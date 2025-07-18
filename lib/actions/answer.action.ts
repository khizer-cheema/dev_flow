"use server";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { after } from "next/server";

import ROUTES from "@/constants/routes";
import { Question, Vote } from "@/database";
import Answer, { IAnswerDoc } from "@/database/answer.model";
import { CreateAnswerParams, DeleteAnswerParams, getAnswersParams } from "@/types/action";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { AnswerServerSchema, DeleteAnswerSchema, getAnswersSchema } from "../validations";
import { CreateInteraction } from "./interaction.action";


export async function CreateAnswer(params:CreateAnswerParams):Promise<ActionResponse<IAnswerDoc>> {

  const validationResult = await action({
    params,
    schema:AnswerServerSchema,
    authorize:true
  });

  if(validationResult instanceof Error){
    return handleError(validationResult) as ErrorResponse;
  }

  
    const {questionId,content} = validationResult.params!;
    const userId =  validationResult?.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const question = await Question.findById(questionId);
    if(!question) throw new Error("Question not found");
    const [newAnswer] = await Answer.create(
      [{
        author:userId,
        question:questionId,
        content
      }],{session}
    );
    if(!newAnswer) throw new Error("Failed to create Answer");
    question.answers +=1;
    await question.save({session});

    // log the interaction
    after(async()=>{
      await CreateInteraction({
        action:"post",
        actionId:newAnswer._id.toString(),
        actionTarget:"answer",
        authorId:userId as string
      })
    })
    
    await session.commitTransaction();
    session.endSession();
    revalidatePath(ROUTES.QUESTION(questionId));
      
      return {
        success:true,
        data:JSON.parse(JSON.stringify(newAnswer))
      };

  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  }finally{
    session.endSession();
  }
}

export async function getAnswers(params:getAnswersParams):Promise<ActionResponse<{answers:Answer[];isNext:boolean,totalAnswers:number}>>{
  const validationResult = await action({
    params,
    schema:getAnswersSchema
  })
  if(validationResult instanceof Error){
    return handleError(validationResult) as ErrorResponse;
  }

  const {page=1,pageSize=10,filter,questionId} = params;
  const skip = (Number(page)-1)*pageSize;
  const limit = Number(pageSize);
  
    let sortCriteria = {};
    switch(filter) {
      case "latest":
        sortCriteria = {crearedAt:-1};
        break;
      case "oldest":
        sortCriteria = {createdAt:1};
        break;
      case "popular":
        sortCriteria = {upvotes:-1};
        break;    
      default:
        sortCriteria = {createdAt:-1};
        break;  
    }
    
    try {
      const totalAnswers = await Answer.countDocuments({question:questionId});
      const answers = await Answer.find({question:questionId})
      .populate("author"," _id name image")
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);
    
      const isNext = totalAnswers > skip + answers.length;   
      return { 
        success:true,
        data:{answers:JSON.parse(JSON.stringify(answers)),isNext,totalAnswers},
      }
    } catch (error) {
      return handleError(error) as ErrorResponse;
    }

}

export async function DeleteAnswer(params:DeleteAnswerParams):Promise<ActionResponse> {

  const validationResult = await action({
    params,
    schema:DeleteAnswerSchema,
    authorize:true
  });

  if(validationResult instanceof Error){
    return handleError(validationResult) as ErrorResponse;
  }

  
    const {answerId} = validationResult.params!;
    const {user} =  validationResult.session!;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const answer = await Answer.findById(answerId).session(session);
    if(!answer) throw new Error("Answer not found.");
    if(answer.author.toString() !== user?.id) throw new Error("You are not authorized to delte this answer.");

    await Question.findByIdAndUpdate(answer.question,
      {$inc:{answers:-1}},{new:true,session});

    await Vote.deleteMany({actionId:answerId,actionType:"answer"}).session(session);

    await Answer.findByIdAndDelete(answerId).session(session);

    await session.commitTransaction();
      
    revalidatePath(`/profile/${user?.id}`)
      return {success:true};

  } catch (error) {
    session.abortTransaction();
    return handleError(error) as ErrorResponse;
  }finally{
    session.endSession();
  }
}
