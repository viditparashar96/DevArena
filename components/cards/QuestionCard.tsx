import Answers from "@/public/Answers.svg";
import like from "@/public/like.svg";
import View from "@/public/view.svg";

import { getTimeStamp } from "@/lib/utils";
import Link from "next/link";
import Metric from "../shared/Metric";
import RenderTag from "../shared/RenderTag";
interface QuestionCardProps {
  question: any;
}
const QuestionCard = ({ question }: QuestionCardProps) => {
  const time = getTimeStamp(question.createdAt);
  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11 ">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {time}
          </span>
          <Link href={`/question/${question._id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {question?.title}
            </h3>
          </Link>
        </div>
        {/* If singned in add edit delete actions */}
      </div>
      <div className="mt-3.5 flex flex-wrap gap-2">
        {question.tags.map((tag: any) => (
          <RenderTag key={tag._id} tag={tag} />
        ))}
      </div>
      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={like}
          alt="user"
          value={"John Doe"}
          title={`- asked ${getTimeStamp(question.createdAt)}`}
          href={`/profile/${123}`}
          isAuthor
          textStyle="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl={like}
          alt="like"
          value={question.upvotes}
          title="Votes"
          textStyle="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl={Answers}
          alt="Answers"
          value={question.answers}
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
    </div>
  );
};

export default QuestionCard;
