"use server";

import mongoose, { FilterQuery } from "mongoose";
import { revalidatePath } from "next/cache";

import ROUTES from "@/constants/routes";
import { Answer, Collection, Vote } from "@/database";
import Question, { IQuestionDoc } from "@/database/question.model";
import TagQuestion from "@/database/tag-question.model";
import Tag, { ITagDoc } from "@/database/tag.model";

import action from "../handlers/action";
import handleError from "../handlers/error";
import dbConnect from "../mongoose";
import { AskQuestionSchema, DeleteQuestionSchema, EditQuestionSchema, GetQuestionSchema, IncementViewsSchema, paginatedSearchParamsSchema } from "../validations";


export async function CreateQuestion(params:CreateQuestionParams):Promise<ActionResponse<Question>> {

  const validationResult = await action({
    params,
    schema:AskQuestionSchema,
    authorize:true
  });

  if(validationResult instanceof Error){
    return handleError(validationResult) as ErrorResponse;
  }

  
    const {title,content,tags} = validationResult.params!;
    const userId =  validationResult?.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const [question] = await Question.create([{title,content,author:userId}],{session});
    if(!question) throw new Error("Failed to create question");

    const tagIds:mongoose.Types.ObjectId[] = [];
    const tagQustionDocuments = [];

    for (const tag of tags){
      const existingTag = await Tag.findOneAndUpdate(
        {name:{$regex:`^${tag}$`,$options:"i"}},
        {$setOnInsert:{name:tag},
        $inc:{question:1}},{upsert:true,new:true,session}
      );
      tagIds.push(existingTag._id);
      tagQustionDocuments.push(
        {tag:existingTag._id,
        question:question._id,
    });
    }
    await TagQuestion.insertMany(tagQustionDocuments,{session});
    await Question.findByIdAndUpdate(
      question._id,
      {$push:{tags:{$each:tagIds}}},
      {session});

      await session.commitTransaction();
      
      return {success:true,data:JSON.parse(JSON.stringify(question))}

  } catch (error) {
    session.abortTransaction();
    return handleError(error) as ErrorResponse;
  }finally{
    session.endSession();
  }
}
export async function EditQuestion(params:EditQuestionParams):Promise<ActionResponse<IQuestionDoc>> {

  const validationResult = await action({
    params,
    schema:EditQuestionSchema,
    authorize:true
  });

  if(validationResult instanceof Error){
    return handleError(validationResult) as ErrorResponse;
  }

  
    const {title,content,tags,questionId} = validationResult.params!;
    const userId =  validationResult?.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const question = await Question.findById(questionId).populate("tags");
    if(!question){
      throw new Error("Question not found")
    }
    if(question.author.toString() !== userId){
      throw new Error("Unauthorized to Edit question.please login first");
    }
    if(question.title !== title || question.content !== content){
      question.title=title;
      question.content = content
      await question.save({session});
    }
    const tagsToAdd = tags.filter(
      (tag)=> !question.tags.some((t:ITagDoc)=>t.name.toLowerCase().includes(tag.toLowerCase())
      )
    );
    const tagsToRemove = question.tags.filter(
      (tag:ITagDoc)=>!tags.some((t)=>t.toLowerCase()===tag.name.toLowerCase())
    );

    const newTagDocuments = [];

  if(tagsToAdd.length>0){
    for (const tag of tagsToAdd){
      const existingTag = await Tag.findOneAndUpdate(
        {name:{$regex:`^${tag}$`,$options:"i"}},
        {$setOnInsert:{name:tag},
        $inc:{question:1}},{upsert:true,new:true,session}
      );
     if(existingTag){
      newTagDocuments.push({
        tag:existingTag._id,
        question:questionId
      });
      question.tags.push(existingTag._id);
     } 
  }  
    
  }

  if(tagsToRemove.length>0){
    const tagIdsToRemove = tagsToRemove.map((tag:ITagDoc)=>tag._id);

    await Tag.updateMany(
      {_id:{$in:tagIdsToRemove}},
      {$inc:{questions:-1}},
      {session}
    );
    await TagQuestion.deleteMany(
      {tag:{$in:tagIdsToRemove},
    question:questionId},
    {session}
    );
    question.tags = question.tags.filter(
      (tag:mongoose.Types.ObjectId) => !tagIdsToRemove.some((id:mongoose.Types.ObjectId)=> id.equals(tag._id)
      )
    );

  }

  if(newTagDocuments.length>0){
    await TagQuestion.insertMany(newTagDocuments,
      {session}
    );
  }

    await question.save({session});
    await session.commitTransaction();
      
      return {success:true,data:JSON.parse(JSON.stringify(question))};

  } catch (error) {
    session.abortTransaction();
    return handleError(error) as ErrorResponse;
  }finally{
    session.endSession();
  }
}
export async function DeleteQuestion(params:DeleteQuestionParams):Promise<ActionResponse> {

  const validationResult = await action({
    params,
    schema:DeleteQuestionSchema,
    authorize:true
  });

  if(validationResult instanceof Error){
    return handleError(validationResult) as ErrorResponse;
  }

  
    const {questionId} = validationResult.params!;
    const {user} =  validationResult.session!;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const question = await Question.findById(questionId);
    if(!question){
      throw new Error("Question not found")
    }
    if(question.author.toString() !== user?.id){
      throw new Error("You are not authorized to Delete question.");
    }
   await Collection.deleteMany({question:questionId}).session(session);
   await TagQuestion.deleteMany({question:questionId}).session(session);

   if(question.tags.length>0){
    await Tag.updateMany(
      {_id:{$in:question.tags}},
      {$inc:{questions: -1}},
      {session}
    )
   }

   await Vote.deleteMany({actionId:questionId,actionType:"question"}).session(session);

   const answers = await Answer.find({question:questionId}).session(session);
   if(answers.length>0){
    await Answer.deleteMany({question:questionId}).session(session);
   }

   await Vote.deleteMany(
    {
      actionId:{$in:answers.map((answer)=>answer.id)},
      actionType:"answer"
    }).session(session);

    await Question.findByIdAndDelete(questionId).session(session);

    await session.commitTransaction();
    session.endSession();

    revalidatePath(`/profile/${user?.id}`);
      return {success:true};

  } catch (error) {
    session.abortTransaction();
    session.endSession();
    return handleError(error) as ErrorResponse;
  }
}

export async function GetQuestion(params:GetQuestionParams):Promise<ActionResponse<Question>> {

  const validationResult = await action({
    params,
    schema:GetQuestionSchema,
    authorize:true
  });

  if(validationResult instanceof Error){
    return handleError(validationResult) as ErrorResponse;
  }
  const {questionId} = validationResult.params!;
  try {
    const question = await Question.findById(questionId).populate("tags")
    .populate("author","_id name image");
    if(!question){
      throw new Error("Question not found");
    }
    return {success:true, data:JSON.parse(JSON.stringify(question))};
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function incrementViews(params:IncrementViewsParams):Promise<ActionResponse<{views:number}>> {

  const validationResult = await action({
    params,
    schema:IncementViewsSchema,
  });

  if(validationResult instanceof Error){
    return handleError(validationResult) as ErrorResponse;
  }
  const {questionId} = validationResult.params!;
  try {
    const question = await Question.findById(questionId);
    if(!question){
      throw new Error("Question not found");
    }
    question.views +=1;
    await question.save();
    revalidatePath(ROUTES.QUESTION(questionId));
    return {
      success:true, 
      data:{views:question.views}
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function getQuestions(params:paginatedSearchParams):Promise<ActionResponse<{questions:Question[];isNext:boolean}>>{
  const validationResult = await action({
    params,
    schema:paginatedSearchParamsSchema
  })
  if(validationResult instanceof Error){
    return handleError(validationResult) as ErrorResponse;
  }

  const {page=1,pageSize=10,query,filter} = params;
  const skip = (Number(page)-1)*pageSize;
  const limit = Number(pageSize);
  
  const filterQuery:FilterQuery<typeof Question> = {};

  if(filter==="recommended")
    return {success:true,data:{questions:[],isNext:false}};
  
  if(query){
    filterQuery.$or = [
      { title:{$regex:query,$options:"i"}},
      { content:{$regex:query,$options:"i"}}
    ]
  }  
    let sortCriteria = {};
    switch(filter) {
      case "newest":
        sortCriteria = {crearedAt:-1};
        break;
      case "unanswered":
        filterQuery.answer = 0;
        sortCriteria = {createdAt:-1};
        break;
      case "popular":
        sortCriteria = {upvotes:-1};
        break;    
      default:
        sortCriteria = {createdAt:-1};
        break;  
    }
    
    try {
      const totalQuestions = await Question.countDocuments(filterQuery);
      const questions = await Question.find(filterQuery).populate("tags","name").populate("author","name image").lean().sort(sortCriteria).skip(skip).limit(limit);
    
      const isNext = totalQuestions > skip + questions.length;   
      return { 
        success:true,
        data:{questions:JSON.parse(JSON.stringify(questions)),isNext},
      }
    } catch (error) {
      return handleError(error) as ErrorResponse;
    }

}

export async function getHotQuestions():Promise<ActionResponse<Question[]>>{
  try {
    await dbConnect();
    const questions= await Question.find().sort({views:-1,upvotes:-1}).limit(5);

    return {
      success:true,
      data:JSON.parse(JSON.stringify(questions))
    }
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}