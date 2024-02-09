import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";
import RenderTag from "../RenderTag";

const RightSidebar = () => {
  const hostQuestions = [
    { _id: 1, title: "How to create a new project in Figma?" },
    { _id: 2, title: "How to create a new project in Figma?" },
    { _id: 3, title: "How to create a new project in Figma?" },
    { _id: 4, title: "How to create a new project in Figma?" },
  ];

  const popularTags = [
    { _id: 1, name: "React", totalQuestions: 11 },
    { _id: 2, name: "Nextjs", totalQuestions: 4 },
    { _id: 3, name: "Nodejs", totalQuestions: 50 },
    { _id: 4, name: "CSS", totalQuestions: 10 },
  ];
  return (
    <section className=" background-light900_dark200 custom-scrollbar light-border sticky right-0 top-0 flex h-screen w-[350px]  flex-col overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden">
      <div>
        <h3 className=" h3-bold text-dark200_light900">Top Questions</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {hostQuestions?.map((question) => (
            <Link
              href={`/question/${question._id}`}
              key={question._id}
              className=" flex-between cursor-pointer gap-7"
            >
              <p className=" body-medium text-dark500_light700">
                {question.title}
              </p>
              <IoIosArrowForward className=" text-dark500_light700" />
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">
          Popular Tags Questions
        </h3>
        <div className="mt-7 flex flex-col gap-4">
          {popularTags?.map((tag) => <RenderTag key={tag._id} tag={tag} />)}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
