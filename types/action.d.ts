
import mongoose from "mongoose"

import { IInteractionDoc } from "@/database/interaction.model"

interface signinWithOAuthParams{
  provider:'github' | 'google',
  providerAccountId:string
  user:{
    email:string,
    name:string,
    image:string,
    username:string
  }
}

interface AuthCredentials{
  name:string,
  username:string,
  email:string,
  password:string
}

interface CreateQuestionParams{
  title:string,
  content:string,
  tags:string[]
}
interface EditQuestionParams extends CreateQuestionParams {
    questionId:string;
}
interface GetQuestionParams {
    questionId:string;
}
interface DeleteQuestionParams {
  questionId:string;
}

interface getTagQuestionsParams extends Omit<paginatedSearchParams,"filter"> {
  tagId:string
}
interface IncrementViewsParams{
  questionId:string;
}

interface CreateAnswerParams{
  questionId:string;
  content:string
}

interface getAnswersParams extends paginatedSearchParams{
  questionId:string
}

interface DeleteAnswerParams {
  answerId:string;
}

interface createVoteParams {
  targetId:string;
  targetType:'question' | 'answer';
  voteType:'upvote' | 'downvote';
}

interface updateVoteCountParams  extends createVoteParams{
  change: 1 | -1;
}
type HasVotedParams = Pick<createVoteParams, "targetId" | "targetType">;
interface HasVotedResponse {
  hasUpvoted: boolean;
  hasDownvoted: boolean;
}

interface collectionBaseParams {
  questionId: string;
}

interface GetUserParams{
  userId:string;
}

interface GetUserQuestionsParams extends Omit<
paginatedSearchParams, "query" | "filter" | "sort">{
  userId:string;
}
interface GetUserAnswersParams extends
paginatedSearchParams {
  userId:string;
}
interface GetUserTagsParams{
  userId:string;
}

interface UpdateReputationParams {
  interaction:IInteractionDoc;
  session:mongoose.ClientSession;
  performerId:string;
  authorId:string
}

interface CreateInteractionParams {
  action: "view" | "upvote" | "downvote" | "bookmark" | "post" | "edit" | "delete" | "search";
  actionId:string;
  authorId:string;
  actionTarget: "question" | "answer"
}