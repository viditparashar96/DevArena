import darkillu from "@/public/darkllustration2.png";
import lightillu from "@/public/light-illu.png";

import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

interface NoResultProps {
  title: string;
  description: string;
  link: string;
  linkText: string;
}
const NoResult = ({ title, description, link, linkText }: NoResultProps) => {
  return (
    <div className=" mt-10 flex w-full flex-col items-center justify-center">
      <Image
        src={lightillu}
        alt="No result found"
        width={270}
        height={200}
        className="block object-contain dark:hidden"
      />
      <Image
        src={darkillu}
        alt="No result found"
        width={270}
        height={200}
        className=" hidden object-contain dark:block"
      />
      <h2 className="h2-bold text-dark200_light900 mt-8">{title}</h2>
      <p className=" body-regular text-dark500_light700 my-3.5 max-w-md text-center">
        {description}
      </p>
      <Link href={link}>
        <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
          {linkText}
        </Button>
      </Link>
    </div>
  );
};

export default NoResult;
