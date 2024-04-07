import Filter from "@/components/shared/Filter";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { TagFilters } from "@/constants/filters";
import { getAllTags } from "@/lib/actions/tag.actions";
import { SearchParamsProps } from "@/types";
import Link from "next/link";

const Page = async ({ searchParams }: SearchParamsProps) => {
  const tags: any = await getAllTags({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
  });
  console.log(tags);
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row">
        <h1 className="h1-bold text-dark100_light900">All Tags</h1>
      </div>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/tags"
          iconPosition="left"
          placeholder="Search for Tags"
          otherClasses="flex-1"
        />
        <Filter
          filters={TagFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="max-md:flex "
        />
      </div>

      <section className="mt-12 flex flex-wrap gap-4">
        {tags?.length > 0 ? (
          tags.map((tag: any) => {
            return (
              <Link
                href={`/tags/${tag._id}`}
                key={tag._id}
                className=" shadow-light100_darknone"
              >
                <article className="background-light900_dark200 light-border flex w-full flex-col rounded-2xl border px-8 py-10 sm:w-[260px]">
                  <div className=" background-light800_dark300 w-fit rounded-sm px-5 py-1.5">
                    <p className=" paragraph-semibold text-dark300_light900">
                      {tag.name}
                    </p>
                  </div>
                  <p className=" small-medium text-dark400_light500 mt-3.5">
                    <span className="body-semibold primary-text-gradient mr-2.5">
                      {tag.questions.length}+
                    </span>{" "}
                    Questions
                  </p>
                </article>
              </Link>
            );
          })
        ) : (
          <div className="paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center">
            <p className="text-dark200_light800 text-center">No Tags Found</p>
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
