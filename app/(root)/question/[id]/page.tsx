import Answer from "@/components/forms/Answer";
import AllAnswers from "@/components/shared/AllAnswers";
import Metric from "@/components/shared/Metric";
import ParseHtml from "@/components/shared/ParseHtml";
import RenderTag from "@/components/shared/RenderTag";
import Voting from "@/components/shared/Voting";
import { getQuestionById } from "@/lib/actions/question.actions";
import { getUserById } from "@/lib/actions/user.action";
import { getTimeStamp } from "@/lib/utils";
import Answers from "@/public/Answers.svg";
import like from "@/public/like.svg";
import View from "@/public/view.svg";
import { auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
const Page = async ({ params }: any) => {
  const { id } = params;
  const question = await getQuestionById(id);
  const { userId: clerkId } = auth();
  let mongoUser;
  if (clerkId) {
    mongoUser = await getUserById({ userId: clerkId });
  }
  // console.log(question);
  return (
    <>
      <div className=" flex-start w-full flex-col">
        <div className=" flex w-full flex-col-reverse  justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${question.author.clerkId}`}
            className="flex items-center justify-start gap-2"
          >
            <Image
              src={question.author.picture}
              alt={question.author.name}
              className=" rounded-full"
              width={22}
              height={22}
            />
            <p className="paragraph-semibold text-dark300_light700">
              {question.author.name}
            </p>
          </Link>
          <div className=" flex justify-end">
            <Voting
              type="question"
              itemId={JSON.stringify(question._id)}
              userId={JSON.stringify(mongoUser?._id)}
              upvotes={question.upvotes.length}
              hasupvoted={question.upvotes.includes(mongoUser?._id)}
              downvotes={question.downvotes.length}
              hasdownvoted={question.downvotes.includes(mongoUser?._id)}
              hasSaved={mongoUser?.saved.includes(question._id)}
            />
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 m-3.5 w-full text-left">
          {question.title}
        </h2>
      </div>
      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl={like}
          alt="like"
          value={`asked ${getTimeStamp(question.createdAt)}`}
          title="Asked"
          textStyle="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl={Answers}
          alt="Answers"
          value={question.answers.length}
          title="Answers"
          textStyle="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl={View}
          alt="Views"
          value={question.views}
          title="Views"
          textStyle="small-medium text-dark400_light800"
        />
      </div>
      <ParseHtml content={question.explanation} />
      <div className=" mt-8 flex flex-wrap justify-start gap-2">
        {question.tags.map((tag: any) => (
          <RenderTag key={tag.id} tag={tag} />
        ))}
      </div>

      <AllAnswers
        questionId={JSON.stringify(question._id)}
        userId={JSON.stringify(mongoUser?._id)}
        totalAnswers={question.answers.length}
      />

      <Answer
        question={question.explanation}
        questionId={JSON.stringify(question._id)}
        authorId={JSON.stringify(mongoUser?._id)}
      />
    </>
  );
};

export default Page;
