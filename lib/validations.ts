import { InteractionActionEnum } from "@/database/interaction.model";
import { z } from "zod";

export const SignInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please provide a valid email address." }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long. " })
    .max(100, { message: "Password cannot exceed 100 characters." }),
});

export const SignUpSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long." })
    .max(30, { message: "Username cannot exceed 30 characters." })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores.",
    }),

  name: z
    .string()
    .min(1, { message: "Name is required." })
    .max(50, { message: "Name cannot exceed 50 characters." })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name can only contain letters and spaces.",
    }),

  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Please provide a valid email address." }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(100, { message: "Password cannot exceed 100 characters." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    }),
});

export const AskQuestionSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title is required" })
    .max(100, { message: "Title cannot exceed 100 characters" }),
  content: z.string().min(1, { message: "content is required" }),
  tags: z
    .array(
      z
        .string()
        .min(1, { message: "Tag is required" })
        .max(30, { message: "tag cannot exceed 30 characters" })
    )
    .min(1, { message: "At least 1 Tag is required" })
    .max(3, { message: "cannot add more than 3 tags" }),
});

export const EditQuestionSchema = AskQuestionSchema.extend({
  questionId:z.string().min(1,{message:"Question ID is required"})
})

export const GetQuestionSchema = z.object({
  questionId:z.string().min(1,{message:"Question ID is required"})
})
export const DeleteQuestionSchema = z.object({
  questionId:z.string().min(1,{message:"Question ID is required."})
})

export const paginatedSearchParamsSchema =z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().default(10),
  query:z.string().optional(),
  filter:z.string().optional(),
  sort:z.string().optional()
})

export const UserSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  username: z
    .string()
    .min(3, { message: "username must be atleast 3 characters long." }),
  email: z.string().email({ message: "please provide a valid email address" }),
  bio: z.string().optional(),
  image: z.string().url({ message: "please provide a valid URL" }).optional(),
  location: z.string().optional(),
  portfolio: z
    .string()
    .url({ message: "please provide a valid URL" })
    .optional(),
  reputation: z.number().optional(),
});
export const GetUserSchema = z.object({
  userId:z.string().min(1,{message:"user ID is required."})
}) 

export const GetUserQuestionsSchema = paginatedSearchParamsSchema.extend({
  userId:z.string().min(1,{message:"Question ID is required"})
})
export const GetUserAnswersSchema = paginatedSearchParamsSchema.extend({
  userId:z.string().min(1,{message:"Question ID is required"})
})

export const GetUserTagsSchema = z.object({
  userId:z.string().min(1,{message:"user ID is required."})
});

export const AccountSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required" }),
  name: z.string().min(1, { message: "Name is required" }),
  image: z
    .string()
    .url({ message: "Please provide a valid image URL" })
    .optional(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(100, { message: "password cannot exceed 100 characters" })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character",
    })
    .optional(),

  provider: z.string().min(1, { message: "Provider is required" }),

  providerAccountId: z
    .string()
    .min(1, { message: "Provider Account ID is required" }),
});

export const SigninWithOAuthSchema = z.object(
  {
    provider:z.enum(["github","google"]),
    providerAccountId: z.string().min(1,{message:"provider Account ID is required"}),
    user: z.object({
      name:z.string().min(1,{message:"name is required"}),
      username:z.string().min(3,{message:"username must be atleast 3 characters long"}),
      email:z.string().email({message:"please provide a valid email address"}),
      image: z.string().url({message:"invalid image URL"}).optional(),
    })
  }
)

export const getTagQuestionsSchema = paginatedSearchParamsSchema.extend({
  tagId:z.string().min(1,{message:"Tag ID is required"})
})
export const IncementViewsSchema = z.object({
  questionId:z.string().min(1,{message:"Question ID is required"})
})

export const AnswerSchema = z.object({
  content:z.string().min(100,{message:"Answer has to have moe than 100 characters"})
})

export const AnswerServerSchema = AnswerSchema.extend({
  questionId:z.string().min(1,{message:"Question ID is required"})
});

export const getAnswersSchema = paginatedSearchParamsSchema.extend({
  questionId:z.string().min(1,{message:"Question ID is required."})
})

export const DeleteAnswerSchema = z.object({
  answerId:z.string().min(1,{message:"Answer Id is required."})
}) 

export const createVoteSchema = z.object({
  targetId: z.string().min(1, { message: "Target ID is required" }),
  targetType: z.enum(["question", "answer"],{message:"Invalid target type."}),
  voteType: z.enum(["upvote", "downvote"],{message:"Invalid vote type."}),
});
export const updateVoteCountSchema = createVoteSchema.extend({
  change: z.number().int().min(-1).max(1)
});

export const hasVotedSchema = createVoteSchema.pick({
  targetId:true,
  targetType:true
})

export const collectionBaseSchema = z.object({
  questionId: z.string().min(1, { message: "Question ID is required" }),
})

export const CreateInteractionSchema = z.object({
  action:z.enum(InteractionActionEnum),
  actionTarget:z.enum(["question","answer"]),
  actionId:z.string().min(1),
  authorId:z.string().min(1)
})