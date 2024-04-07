"use client";
import { globalSearch } from "@/lib/actions/general.action";
import { ReloadIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import GlobalFilters from "./search/GlobalFilters";

const GlobalResults = () => {
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const global = searchParams.get("global");
  const type = searchParams.get("type");

  const [result, setResult] = useState([]);

  useEffect(() => {
    const fecthResult = async () => {
      //   setResult([]);
      setLoading(true);
      try {
        // Every thing fecth from the database
        const res: any = await globalSearch({ query: global, type });
        setResult(JSON.parse(res));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (global) {
      fecthResult();
    }
  }, [global, type]);

  const renderLink = (type: string, id: string) => {
    switch (type) {
      case "question":
        return `/question/${id}`;
      case "answer":
        return `/question/${id}`;

      case "tag":
        return `/tags/${id}`;
      case "user":
        return `/profile/${id}`;
      default:
        return "/";
    }
  };
  return (
    <div className=" absolute top-full z-10 mt-3 w-full rounded-xl bg-light-800 py-5 shadow-sm dark:bg-dark-400">
      <GlobalFilters />
      <div className="my-5 h-[1px] bg-light-700/50 dark:bg-dark-500/50"></div>
      <div className=" space-y-5">
        <p className="text-dark400_light900 paragraph-semibold px-5">
          Top Match
        </p>

        {loading ? (
          <div className=" flex-center flex-col px-5">
            <ReloadIcon className=" my-2 size-10 animate-spin text-primary-500" />
            <p className=" text-dark200_light800">Browsing the database...</p>
          </div>
        ) : (
          <div className=" flex flex-col gap-2">
            {result.length > 0 ? (
              result.map((item: any, index) => (
                <Link
                  href={renderLink(item.type, item.id)}
                  key={item.type + index}
                  className=" flex gap-2  px-5 py-3 transition-colors duration-200 ease-in-out hover:bg-light-700 dark:hover:bg-dark-500"
                >
                  <Image
                    src="/tag.png"
                    alt="tags"
                    width={18}
                    height={18}
                    className=" invert-colors mt-1 object-contain"
                  />
                  <div className=" flex flex-col ">
                    <p className=" body-medium text-dark200_light800 line-clamp-1">
                      {item.title}
                    </p>
                    <p className=" text-light400_light500 small-medium mt-1 font-bold">
                      {item.type}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className=" text-dark200_light800 px-5 text-center">
                No result found
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalResults;
