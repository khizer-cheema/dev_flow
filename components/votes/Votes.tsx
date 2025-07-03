"use client";
import { formatNumber } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useState } from 'react'
import { toast } from 'sonner';
interface Props {
  upvotes: number
  downvotes: number
  hasUpvoted: boolean
  hasDownvoted: boolean
}
const Votes = ({upvotes,downvotes,hasUpvoted,hasDownvoted}:Props) => {
  const session = useSession();
  const userId = session.data?.user?.id;
  
  const [isLoading, setIsLoading] = useState(false);
  const handleVote = async (voteType:"upvote" | "downvote") => {
    if(!userId){
    return toast("Please login to vote", {
      description: "You need to be logged in to vote on questions or answers."})
  }
  setIsLoading(true);
  try {
    const successMessage = voteType === 'upvote' ? `upvote ${!hasUpvoted ? "added":"removed"} successfully` : `downvote ${!hasDownvoted ? "added":"removed"} successfully`;
    toast(successMessage, {
      description: "Your vote has been recorded successfully."
    });
  } catch (error) {
    toast("failed to vote", {
      description: `An ${error} occured while voting. Please try again later.`,})
  }finally{
    setIsLoading(false);
  }
  }
  return (
    <div className='flex flex-center gap-2.5'>
      <div className='flex flex-center gap-1.5'>
        <Image
          src={hasUpvoted ? '/icons/upvoted.svg' : '/icons/upvote.svg'}
          alt='upvote icon'
          width={18}
          height={18} 
          className={`cursor-pointer ${isLoading && "opacity-50"}`}
          aria-label='upvote'
          onClick={() => 
            isLoading && handleVote('upvote')
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
          src={hasDownvoted ? '/icons/downvoted.svg' : '/icons/downvote.svg'}
          alt='upvote icon'
          width={18}
          height={18} 
          className={`cursor-pointer ${isLoading && "opacity-50"}`}
          aria-label='downvote'
          onClick={() => 
            isLoading && handleVote('downvote')
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