"use client";

import Image from 'next/image';
import { useSession } from 'next-auth/react';
import React, { use, useState } from 'react'
import { toast } from 'sonner';

import { createVote } from '@/lib/actions/vote.action';
import { formatNumber } from '@/lib/utils';

interface Prams {
  targetType: "question" | "answer"
  targetId: string
  upvotes: number
  downvotes: number
  hasVotedPromise:Promise<ActionResponse<HasVotedResponse>>
}
const Votes = ({upvotes,downvotes,targetId,targetType,hasVotedPromise}:Prams) => {
  const session = useSession();
  const userId = session.data?.user?.id;

  const {success,data}= use(hasVotedPromise);
  
  const [isLoading, setIsLoading] = useState(false);

  const {hasUpvoted, hasDownvoted} = data || {};

  const handleVote = async (voteType:"upvote" | "downvote") => {
    if(!userId){
    return toast.error("Please login to vote", {
      description: "You need to be logged in to vote on questions or answers."})
  }
  setIsLoading(true);
  try {
    const result = await createVote({
      targetId,targetType,voteType
    });
    
    if(!result.success){
      return toast.error("failed to vote", {
        description: result.error?.message,
      })
    }
    const successMessage = voteType ===
    "upvote" ? `Upvote ${!hasUpvoted 
    ? "added":"removed"} successfully` 
    : `Downvote ${!hasDownvoted ? "added":"removed"} successfully`;
    toast(successMessage, {
      description: "Your vote has been recorded successfully."
    });
  } catch{
    toast.error("failed to vote", {
      description: "An error occured while voting. Please try again later.",})
  }finally{
    setIsLoading(false);
  }
  }
  return (
    <div className='flex flex-center gap-2.5'>
      <div className='flex flex-center gap-1.5'>
        <Image
          src={success && hasUpvoted ? '/icons/upvoted.svg' : '/icons/upvote.svg'}
          alt='upvote icon'
          width={18}
          height={18} 
          className={`cursor-pointer ${isLoading && "opacity-50"}`}
          aria-label='Upvote'
          onClick={() => 
            !isLoading && handleVote("upvote")
          }
        />
        <div className='flex flex-center background-light700_dark400 min-w-5 rounded-sm p-1'>
          <p className='subtle-medium text-dark400_light900'>
            {formatNumber(upvotes)}
          </p>
        </div>
  
      </div>
      <div className='flex flex-center gap-1.5'>
        <Image
          src={success && hasDownvoted ? "/icons/downvoted.svg" : "/icons/downvote.svg"}
          alt="downvote"
          width={18}
          height={18} 
          className={`cursor-pointer ${isLoading && "opacity-50"}`}
          aria-label='downvote'
          onClick={() => 
            !isLoading && handleVote("downvote")
          }
        />
        <div className='flex flex-center background-light700_dark400 min-w-5 rounded-sm p-1'>
          <p className='subtle-medium text-dark400_light900'>
            {formatNumber(downvotes)}
          </p>
        </div>
  
      </div>
    </div>
  )
}

export default Votes