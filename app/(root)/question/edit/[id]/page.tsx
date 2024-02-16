import Question from "@/components/forms/Question";
import { getQuestionById } from "@/lib/actions/question.actions";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";

const Page = async ({ params }: any) => {
  const { id } = params;
  console.log(id);
  const { userId } = auth();
  if (!userId) return null;
  const mongoUser = await getUserById({ userId });
  const result = await getQuestionById(id);
  console.log(result);
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Question</h1>
      <div className=" mt-9">
        <Question
          type="Edit"
          mongoUserId={JSON.stringify(mongoUser._id)}
          questionDetails={JSON.stringify(result)}
        />
      </div>
    </>
  );
};

export default Page;
