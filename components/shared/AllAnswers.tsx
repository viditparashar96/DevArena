import { AnswerFilters } from "@/constants/filters";
import { getAnswers } from "@/lib/actions/answer.action";
import { getTimeStamp } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import Filter from "./Filter";
import ParseHtml from "./ParseHtml";
import Voting from "./Voting";

interface AllAnswersProps {
  questionId: string;
  userId: string;
  totalAnswers: number;
  page?: number;
  filter?: number;
  searchParams: any;
}

const AllAnswers = async ({
  questionId,
  userId,
  totalAnswers,
  page,
  searchParams,
}: AllAnswersProps) => {
  const answers: any = await getAnswers({
    questionId,
    page: page ? +page : 1,
    filter: searchParams.filter,
  });
  //   console.log(answers);
  return (
    <div className="mt-11">
      <div className=" flex items-center justify-between">
        <h3 className="h3-bold primary-text-gradient">
          {totalAnswers} Answers
        </h3>
        <Filter filters={AnswerFilters} />
      </div>
      <div>
        {answers.map((answer: any) => (
          <article key={answer._id} className=" light-border border-b py-10">
            <div className="flex items-center justify-between ">
              {/* SPAN ID */}
              <div className=" mb-8 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
                <Link
                  href={`/profile/${answer.author.clerkId}`}
                  className="flex flex-1 items-start gap-1 sm:items-center"
                >
                  <Image
                    src={answer.author.picture}
                    alt={answer.author.name}
                    className="rounded-full object-cover max-sm:mt-0.5"
                    width={22}
                    height={22}
                  />
                  <div className=" flex flex-col sm:flex-row sm:items-center">
                    <p className="text-dark400_light800 body-semibold">
                      {answer.author.name}{" "}
                    </p>
                    <p className=" small-regular text-light400_light500 mt-0.5 line-clamp-1">
                      <span className=" max-sm:hidden "> - </span> answerd{" "}
                      {getTimeStamp(answer.createdAt)}
                    </p>
                  </div>
                </Link>
                <div className="flex justify-end">
                  <Voting
                    type="Answer"
                    itemId={JSON.stringify(answer._id)}
                    userId={JSON.stringify(userId)}
                    upvotes={answer.upvotes.length}
                    hasupvoted={answer.upvotes.includes(userId)}
                    downvotes={answer.downvotes.length}
                    hasdownvoted={answer.downvotes.includes(userId)}
                  />
                </div>
              </div>
            </div>
            <ParseHtml content={answer.content} />
          </article>
        ))}
      </div>
    </div>
  );
};

export default AllAnswers;
