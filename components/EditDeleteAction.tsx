"use client";
import { deleteAnswer } from "@/lib/actions/answer.action";
import { deleteQuestion } from "@/lib/actions/question.actions";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

interface EditDeleteActionProps {
  type: string;
  itemId: string;
}
const EditDeleteAction = ({ type, itemId }: EditDeleteActionProps) => {
  const pathName = usePathname();
  const router = useRouter();
  const handleEdit = () => {
    router.push(`/question/edit/${JSON.parse(itemId)}`);
  };
  const handleDelete = async () => {
    if (type === "Question") {
      await deleteQuestion({ questionId: JSON.parse(itemId), path: pathName });
    } else if (type === "Answer") {
      await deleteAnswer({ answerId: JSON.parse(itemId), path: pathName });
    }
  };
  return (
    <div className=" flex items-center justify-end max-sm:w-full ">
      {type === "Question" && (
        <Image
          src="/edit.svg"
          alt="edit"
          width={14}
          height={14}
          className=" cursor-pointer"
          onClick={handleEdit}
        />
      )}
      <Image
        src="/trash.svg"
        alt="delete"
        width={14}
        height={14}
        className=" cursor-pointer"
        onClick={handleDelete}
      />
    </div>
  );
};

export default EditDeleteAction;
