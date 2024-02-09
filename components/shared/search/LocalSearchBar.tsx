"use client";
import { Input } from "@/components/ui/input";
import { CiSearch } from "react-icons/ci";

interface LocalSearchBarProps {
  route: string;
  iconPosition: string;
  placeholder: string;
  otherClasses?: string;
}

const LocalSearchBar = ({
  route,
  iconPosition,
  placeholder,
  otherClasses,
}: LocalSearchBarProps) => {
  return (
    <div
      className={`background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}
    >
      {iconPosition === "left" && (
        <CiSearch className="text-dark300_light900" />
      )}
      <Input
        type="text"
        placeholder={placeholder}
        onChange={() => {}}
        className=" placeholder text-dark400_light700 border-none bg-transparent outline-none"
      />
    </div>
  );
};

export default LocalSearchBar;
