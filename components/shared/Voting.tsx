"use client";
import Image from "next/image";

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
  const handleSave = () => {};
  const handlevote = (action: string) => {};
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
              handlevote("upvote");
            }}
          />
          <div className=" flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className=" subtle-medium text-dark400_light900">{upvotes}</p>
          </div>
        </div>
      </div>
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
    </div>
  );
};

export default Voting;
