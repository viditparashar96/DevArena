import { getUserQuestions } from "@/lib/actions/user.action";
import QuestionCard from "../cards/QuestionCard";

interface QuestionsTabProps {
  searchParams: any;
  userId: string;
  clerkId: string | null;
}
const QuestionsTab = async ({
  searchParams,
  userId,
  clerkId,
}: QuestionsTabProps) => {
  const results = await getUserQuestions({ userId, page: 1 });
  // console.log(results);
  return (
    <div>
      {results?.questions.map((question) => (
        <QuestionCard
          key={question._id}
          question={question}
          clerkId={clerkId}
        />
      ))}
    </div>
  );
};

export default QuestionsTab;
