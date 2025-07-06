interface Tag {
  _id: string;
  name: string;
}
interface Author {
  _id: string;
  name: string;
  image: string;
}

interface Question {
  _id: string;
  title: string;
  tags: Tag[];
  content:string;
  author: Author;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  answers: number;
  views: number;
}
interface Answer{
  _id:string;
  author:Author;
  content:string;
  upvotes: number;
  downvotes: number;
  createdAt:Date;
}
interface User {
  _id: string;
  name: string;
  username: string;
  bio?: string;
  image?: string;
  location?: string;
  portfolio?: string;
  reputation?: number;
}

interface Collection {
  _id:string;
  author: string | Author;
  question:Question;
}

type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  status?: number;
};

type SuccessResponse<T = null> = ActionResponse<T> & { success: true };
type ErrorResponse = ActionResponse<undefined> & { success: false };

type APIErrorResponse = NextResponse<ErrorResponse>;
type APIResponse<T = null> = NextResponse<SuccessResponse<T> | ErrorResponse>;

interface RouteParams{
  params: Promise<Record<string,string>>,
  searchParams: Promise<Record<string,string>>,
}

interface paginatedSearchParams{
  page?: number,
  pageSize?: number,
  query?: string,
  filter?: string,
  sort?: string
}