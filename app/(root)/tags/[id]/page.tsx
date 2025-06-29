import QuestionCard from '@/components/cards/QuestionCard';
import DataRenderer from '@/components/DataRenderer';
import LocalSearch from '@/components/search/LocalSearch';
import ROUTES from '@/constants/routes';
import { EMPTY_QUESTION } from '@/constants/states';
import { getTagQuestions } from '@/lib/actions/tag.action';

const tagDetailsPage = async ({params,searchParams}:RouteParams) => {
  const{id} = await params;
  const{page,pageSize,query} = await searchParams;
  const{success,error,data} = await getTagQuestions({
    tagId:id,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query
  })
  const {tag,questions} = data || {};
  
  return (
    <>
      <section className=" flex w-full flex-col-reverse sm:flex-row sm:items-center justify-between gap-1">
        <h1 className="h1-bold text-dark100_light900">{tag?.name}</h1>
      </section>
      <section className="mt-11">
        <LocalSearch
          route={ROUTES.TAG(id)}
          ImgSrc="/icons/search.svg"
          placeholder="search question..."
          otherClasses="flex-1"
        />
      </section>
      
      <DataRenderer
        success={success}
        error={error}
        data={questions}
        empty={EMPTY_QUESTION}
        render={(questions)=>(
          <div className="mt-10 w-full flex flex-col gap-6">
            {questions.map((question)=>(
              <QuestionCard
                key={question._id}
                question={question}
              />
            ))}
          </div>
        )}
      />
        </>
  );

}

export default tagDetailsPage