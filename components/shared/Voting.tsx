"use client";
import { downvoteAnswer, upvoteAnswer } from "@/lib/actions/answer.action";
import { viewQuestion } from "@/lib/actions/interaction.action";
import {
  downvoteQuestion,
  upvoteQuestion,
} from "@/lib/actions/question.actions";
import { toggleSaveQuestion } from "@/lib/actions/user.action";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
  type: string;
  itemId: string;
  userId: string;
  upvotes: number;
  hasupvoted: boolean;
  downvotes: number;
  hasdownvoted: boolean;
  hasSaved?: boolean;
}
const Voting = ({
  type,
  itemId,
  userId,
  upvotes,
  hasupvoted,
  downvotes,
  hasdownvoted,
  hasSaved,
}: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const handleSave = async () => {
    if (!userId) {
      alert("Please login to save");
      return;
    }
    console.log("save");
    // save question
    await toggleSaveQuestion({
      userId: JSON.parse(userId),
      questionId: JSON.parse(itemId),
      path: pathname,
    });
  };
  const handlevote = async (action: string) => {
    if (!userId) {
      alert("Please login to vote");
      return;
    }
    if (action === "upvote") {
      console.log("upvote");
      if (type === "Question") {
        await upvoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupvoted,
          hasdownvoted,
          path: pathname,
        });
      } else if (type === "Answer") {
        await upvoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupvoted,
          hasdownvoted,
          path: pathname,
        });
      }
      // show toast
      return;
    }
    if (action === "downvote") {
      console.log("downvote");
      if (type === "Question") {
        await downvoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupvoted,
          hasdownvoted,
          path: pathname,
        });
      } else if (type === "Answer") {
        await downvoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupvoted,
          hasdownvoted,
          path: pathname,
        });
      }
      // show toast
    }
  };

  useEffect(() => {
    viewQuestion({
      questionId: JSON.parse(itemId),
      userId: userId ? JSON.parse(userId) : undefined,
    });
    // alert("viewed");
  }, [itemId, userId, pathname, router]);
  return (
    <div className="flex gap-5">
      <div className=" flex-center gap-2.5">
        <div className=" flex-center gap-1.5">
          <Image
            src={hasupvoted ? "/hasupvoted.svg" : "/upvote.svg"}
            alt="upvote"
            width={18}
            height={18}
            className=" cursor-pointer"
            onClick={() => {
              handlevote("upvote");
            }}
          />
          <div className=" flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className=" subtle-medium text-dark400_light900">{upvotes}</p>
          </div>
        </div>
        <div className=" flex-center gap-1.5">
          <Image
            src={hasdownvoted ? "/hasdownvoted.svg" : "/downvote.svg"}
            alt="dowunvote"
            width={18}
            height={18}
            className=" cursor-pointer"
            onClick={() => {
              handlevote("downvote");
            }}
          />
          <div className=" flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className=" subtle-medium text-dark400_light900">{downvotes}</p>
          </div>
        </div>
      </div>
      {type === "Question" && (
        <Image
          src={hasSaved ? "/hasdownvoted.svg" : "/saved.svg"}
          alt="saved"
          width={18}
          height={18}
          className=" cursor-pointer"
          onClick={() => {
            handleSave();
          }}
        />
      )}
    </div>
  );
};

export default Voting;
