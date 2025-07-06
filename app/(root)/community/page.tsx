import UserCard from "@/components/cards/UserCard";
import DataRenderer from "@/components/DataRenderer";
import LocalSearch from "@/components/search/LocalSearch";
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
  const {users} = data || {};
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>

      <div className="mt-11">
        <LocalSearch
          route={ROUTES.COMMUNITY}
          iconPosition="left"
          ImgSrc="/Icons/search.svg"
          placeholder="There are some great developers here!"
          otherClasses="flex-1"
        />
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
      </div>
    </div>
  )
};

export default Community;
