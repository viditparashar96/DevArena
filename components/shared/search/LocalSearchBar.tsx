"use client";
import { Input } from "@/components/ui/input";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [search, setSearch] = useState(query || "");
  console.log("query", query);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "q",
          value: search,
        });
        router.push(newUrl, { scroll: false });
      } else {
        if (pathname === route) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keys: ["q"],
          });
          router.push(newUrl, { scroll: false });
        }
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, pathname, router, searchParams, query, route]);

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
        onChange={(event: any) => setSearch(event.target.value)}
        className=" placeholder text-dark400_light700 border-none bg-transparent outline-none"
        value={search}
      />
    </div>
  );
};

export default LocalSearchBar;
