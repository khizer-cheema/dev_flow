"use server";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

import ROUTES from "@/constants/routes";
import { Question } from "@/database";
import Answer, { IAnswerDoc } from "@/database/answer.model";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { AnswerServerSchema, getAnswersSchema } from "../validations";

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
    
    await session.commitTransaction();

    revalidatePath(ROUTES.QUESTION(questionId));
      
      return {
        success:true,
        data:JSON.parse(JSON.stringify(newAnswer))
      };

  } catch (error) {
    session.abortTransaction();
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
