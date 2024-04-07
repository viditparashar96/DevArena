import HomeFilter from "@/components/Home/HomeFilter";
import QuestionCard from "@/components/cards/QuestionCard";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import { getQuestions } from "@/lib/actions/question.actions";
import { SearchParamsProps } from "@/types";
import { auth } from "@clerk/nextjs";
// import { formatNumber } from "@/lib/utils";
import Link from "next/link";

// const questions = [
//   {
//     _id: 1,
//     title: "How to create a new project in react?",
//     tags: [
//       { _id: 1, name: "react" },
//       { _id: 2, name: "node" },
//     ],
//     author: "John Doe",
//     upvotes: formatNumber(1700),
//     views: formatNumber(52100),
//     answers: 5,
//     createdAt: new Date("2021-10-10T12:00:00.000Z"),
//   },
//   {
//     _id: 2,
//     title: 'How to use "useEffect" in nextjs?',
//     tags: [
//       { _id: 1, name: "nextjs" },
//       { _id: 2, name: "node" },
//     ],
//     author: "John Doe2",
//     upvotes: 20,
//     views: 80,
//     answers: 2,
//     createdAt: new Date("2021-10-10T12:00:00.000Z"),
//   },
// ];

export default async function Home({ searchParams }: SearchParamsProps) {
  // const { mode } = useTheme();
  const { userId: clerkId } = auth();
  const questions: any = await getQuestions({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
  });
  //  Fecth recommended questions
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>

        <Link href="/ask-question" className=" flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/"
          iconPosition="left"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />
        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="max-md:flex hidden"
        />
      </div>
      <HomeFilter />
      <div className="mt-10 flex w-full flex-col gap-6 ">
        {questions.length > 0 ? (
          questions
            .reverse()
            .map((question: any) => (
              <QuestionCard
                key={question._id}
                question={question}
                clerkId={clerkId}
              />
            ))
        ) : (
          <NoResult
            title="There's no Question to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
            link="/ask-question"
            linkText="Ask a Question"
          />
        )}
      </div>
    </>
  );
}
