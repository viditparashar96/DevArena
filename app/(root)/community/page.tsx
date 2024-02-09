import UserCard from "@/components/cards/UserCard";
import Filter from "@/components/shared/Filter";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { UserFilters } from "@/constants/filters";
import { getAllUsers } from "@/lib/actions/user.action";
import Link from "next/link";

const Page = async () => {
  const users: any = await getAllUsers();
  //   console.log(users);
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row">
        <h1 className="h1-bold text-dark100_light900">All Users</h1>
      </div>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/community"
          iconPosition="left"
          placeholder="Search for User"
          otherClasses="flex-1"
        />
        <Filter
          filters={UserFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="max-md:flex "
        />
      </div>

      <section className="mt-12 flex flex-wrap gap-4">
        {users?.length > 0 ? (
          users.map((user: any) => <UserCard key={user._id} user={user} />)
        ) : (
          <div className="paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center">
            <p className="text-dark200_light800 text-center">No Users Found</p>
            <Link href="/sign-up" className="mt-2 font-bold text-accent-blue">
              join the community!!
            </Link>
          </div>
        )}
      </section>
    </>
  );
};

export default Page;
