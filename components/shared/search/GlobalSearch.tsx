import { Input } from "@/components/ui/input";
import { IoSearchSharp } from "react-icons/io5";

const GlobalSearch = () => {
  return (
    <div className=" relative w-full max-w-[600px]">
      <div className=" background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4 ">
        <IoSearchSharp
          className=" text-dark300_light900 cursor-pointer"
          width={24}
          height={24}
        />
        <Input
          type="text"
          placeholder="Search Globally"
          className=" paragraph-regular no-focus placeholder background-light800_darkgradient border-none shadow-none outline-none "
        />
      </div>
    </div>
  );
};

export default GlobalSearch;
