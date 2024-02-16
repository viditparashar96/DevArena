import { getUserAnswers } from "@/lib/actions/user.action";
import AnswerCard from "../cards/AnswerCard";

const AnswersTab = async ({ searchParams, userId, clerkId }: any) => {
  const result = await getUserAnswers({ userId });
  console.log(result);
  return (
    <>
      <div>
        {result?.answers.map((answer: any) => (
          <AnswerCard
            key={answer._id}
            searchParam={searchParams}
            userId={userId}
            clerkId={clerkId}
            answer={answer}
          />
        ))}
      </div>
    </>
  );
};

export default AnswersTab;
