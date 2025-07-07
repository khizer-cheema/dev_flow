import UserCard from "@/components/cards/UserCard";
import DataRenderer from "@/components/DataRenderer";
import CommonFilter from "@/components/filters/CommonFilter";
import Pagination from "@/components/Pagination";
import LocalSearch from "@/components/search/LocalSearch";
import { UserFilters } from "@/constants/filters";
import ROUTES from "@/constants/routes";
import { EMPTY_USERS } from "@/constants/states";
import { getUsers } from "@/lib/actions/user.action";


const Community = async({searchParams}:RouteParams) => {

  const {page,pageSize,filter,query} = await searchParams;
  
  const {data,success,error} = await getUsers({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    filter,
    query,
  })
  const {users,isNext} = data || {};
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route={ROUTES.COMMUNITY}
          iconPosition="left"
          ImgSrc="/Icons/search.svg"
          placeholder="There are some great developers here!"
          otherClasses="flex-1"
        />
        <CommonFilter
          filters={UserFilters}
          otherClasses="min-h-[56px] sm:min-h-[120px]"
        />
        </div>
        
        <DataRenderer
          data={users}
          success={success}
          error={error}
          empty={EMPTY_USERS}
          render={(users)=>(
            <div>
              {users.map((user) =>(
                <UserCard
                  key={user._id}
                  {...user}
                />
              ))}
            </div>
          )}
        />
        <Pagination
        page={page}
        isNext={isNext||false}
      />
      </div>
  )
};

export default Community;
