import { getTimeStamp } from "@/lib/utils";
import { SignedIn } from "@clerk/nextjs";
import Link from "next/link";
import EditDeleteAction from "../EditDeleteAction";
import Metric from "../shared/Metric";

const AnswerCard = ({ searchParam, userId, clerkId, answer }: any) => {
  const time = getTimeStamp(answer.createdAt);
  const showActionButtons = clerkId && clerkId === answer.author.clerkId;

  console.log(answer);
  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11 ">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {time}
          </span>
          <Link href={`/question/${answer?.question?._id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {answer?.question?.title}
            </h3>
          </Link>
        </div>
        {/* If singned in add edit delete actions */}
        <SignedIn>
          {showActionButtons && (
            <EditDeleteAction
              type="Answer"
              itemId={JSON.stringify(answer._id)}
            />
          )}
        </SignedIn>
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={answer?.author?.picture}
          alt="user"
          value={answer?.author?.username || "Anonymous"}
          title={`- asked ${getTimeStamp(answer.createdAt)}`}
          href={`/profile/${answer?.author?.clerkId}`}
          isAuthor
          textStyle="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/like.svg"
          alt="like"
          value={answer.upvotes?.length}
          title="Votes"
          textStyle="small-medium text-dark400_light800"
        />
      </div>
    </div>
  );
};

export default AnswerCard;
