<<<<<<< HEAD
"use server";
=======
>>>>>>> 1b3cefc746cb434c2343e5c20eb7a2743130b822
import { FilterQuery } from "mongoose";

import { User } from "@/database";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { paginatedSearchParamsSchema } from "../validations";

export async function getUsers(params:paginatedSearchParams):Promise<ActionResponse<{users:User[],isNext:boolean}>>{ 

  const validationResult = await action({
    params,
    schema:paginatedSearchParamsSchema,
  });

  if(validationResult instanceof Error){
    return handleError(validationResult) as ErrorResponse;
  }
  const {page=1,pageSize=10,filter,query} = params;
  const skip = (Number(page)-1)*pageSize;
  const limit = Number(pageSize);
  
  const filterQuery:FilterQuery<typeof User> = {};
<<<<<<< HEAD
    
=======
    let sortCriteria = {};
>>>>>>> 1b3cefc746cb434c2343e5c20eb7a2743130b822
  
  if(query){
    filterQuery.$or = [
      { name: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } },
    ];
  }
<<<<<<< HEAD
  let sortCriteria = {};
  
=======
  if(filter){
>>>>>>> 1b3cefc746cb434c2343e5c20eb7a2743130b822
    switch(filter){
      case "newest":
        sortCriteria = { createdAt: -1 };
        break;
      case "oldest":
        sortCriteria = { createdAt: 1 };
        break;
      case "popular":
        sortCriteria = { reputation: -1 };
        break;
      default:
        sortCriteria = { createdAt: -1 };
        break;
    }
<<<<<<< HEAD
  
=======
  }
>>>>>>> 1b3cefc746cb434c2343e5c20eb7a2743130b822
  try {
    const totalUsers = await User.countDocuments(filterQuery);
    const users = await User.find(filterQuery).sort(sortCriteria).skip(skip).limit(limit);
    const isNext = totalUsers > skip + users.length;
    return {
      success: true,
<<<<<<< HEAD
      data: {users:JSON.parse(JSON.stringify(users))
        ,isNext 
      }
=======
      data: {users:JSON.parse(JSON.stringify(users)),isNext }
>>>>>>> 1b3cefc746cb434c2343e5c20eb7a2743130b822
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
    
  }
}