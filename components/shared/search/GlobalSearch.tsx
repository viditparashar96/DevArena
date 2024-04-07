"use client";
import { Input } from "@/components/ui/input";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next13-progressbar";
import { useEffect, useRef, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import GlobalResults from "../GlobalResults";

const GlobalSearch = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [search, setSearch] = useState(query || "");
  const [isOpen, setIsOpen] = useState(false);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e: any) => {
      if (
        searchContainerRef.current &&
        // @ts-ignore
        !searchContainerRef.current.contains(e.target)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };
    setIsOpen(false);
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [pathname]);
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "global",
          value: search,
        });
        router.push(newUrl, { scroll: false });
      } else {
        if (pathname === "/") {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keys: ["global", "type"],
          });
          router.push(newUrl, { scroll: false });
        }
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, pathname, router, searchParams, query]);
  return (
    <div ref={searchContainerRef} className=" relative w-full max-w-[600px]">
      <div className=" background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4 ">
        <IoSearchSharp
          className=" text-dark300_light900 cursor-pointer"
          width={24}
          height={24}
        />
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!isOpen) {
              setIsOpen(true);
            }
            if (e.target.value === "" && isOpen) {
              setIsOpen(false);
            }
          }}
          type="text"
          placeholder="Search Globally"
          className=" paragraph-regular no-focus text-dark400_light700 placeholder background-light800_darkgradient border-none shadow-none outline-none "
        />
      </div>
      {isOpen && <GlobalResults />}
    </div>
  );
};

export default GlobalSearch;
