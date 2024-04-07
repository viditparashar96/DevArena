"use client";
import { GlobalSearchFilters } from "@/constants/filters";
import { formUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const GlobalFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const [active, setActive] = useState(type || "");
  const handleTypeClick = (item: string) => {
    if (active === item) {
      setActive("");
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "type",
        value: null,
      });
      router.push(newUrl, { scroll: false });
    } else {
      setActive(item);

      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "type",
        value: item.toLowerCase(),
      });
      router.push(newUrl, { scroll: false });
    }
  };
  return (
    <div className=" flex items-center gap-5 px-5 ">
      <p className=" text-dark400_light900 body-medium">Type:</p>
      <div className=" flex gap-3">
        {GlobalSearchFilters.map((filter) => (
          <button
            onClick={() => handleTypeClick(filter.value)}
            type="button"
            className={`light-border-2 small-medium rounded-2xl px-5 py-2 capitalize dark:text-light-800 dark:hover:text-primary-500 ${active === filter.value ? `bg-primary-500 text-light-900 dark:bg-light-900 dark:text-dark-500` : `bg-light-700 text-dark-400 hover:text-primary-500 dark:bg-dark-500 dark:text-light-900`}`}
            key={filter.name}
          >
            {filter.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GlobalFilters;
