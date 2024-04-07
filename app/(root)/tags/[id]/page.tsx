import QuestionCard from "@/components/cards/QuestionCard";
import NoResult from "@/components/shared/NoResult";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { getQuestionsByTag } from "@/lib/actions/tag.actions";
import { URLProps } from "@/types";

const Page = async ({ params, searchParams }: URLProps) => {
  const { id } = params;
  const result: any = await getQuestionsByTag({
    tagId: id,
    page: 1,
    searchQuery: searchParams.q,
  });
  console.log(result);
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">{result?.tagTitle}</h1>
      <div className="mt-11 w-full">
        <LocalSearchBar
          route={`/tags/${id}`}
          iconPosition="left"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />
      </div>
      <div className="mt-10 flex w-full flex-col gap-6 ">
        {result.questions.length > 0 ? (
          result.questions
            .reverse()
            .map((question: any) => (
              <QuestionCard key={question._id} question={question} />
            ))
        ) : (
          <NoResult
            title="There's no Saved Question to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
            link="/ask-question"
            linkText="Ask a Question"
          />
        )}
      </div>
    </>
  );
};

export default Page;
