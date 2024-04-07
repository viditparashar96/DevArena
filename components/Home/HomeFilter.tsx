"use client";
import { HomePageFilters } from "@/constants/filters";
import { formUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";

const HomeFilter = () => {
  const searchParams = useSearchParams();
  const [active, setActive] = useState("");
  const router = useRouter();
  const handleTypeClick = (item: string) => {
    if (active === item) {
      setActive("");
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: null,
      });
      router.push(newUrl, { scroll: false });
    } else {
      setActive(item);

      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: item.toLowerCase(),
      });
      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex">
      {HomePageFilters.map((filter, index) => (
        <Button
          onClickCapture={() => handleTypeClick(filter.value)}
          key={index}
          className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none ${active === filter.value ? " bg-primary-100 text-primary-500" : "dark:hover:bg-drak-300 bg-light-800 text-light-500 hover:bg-light-800 dark:bg-dark-500 dark:text-light-500"}`}
          onClick={() => console.log(filter)}
        >
          {filter.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilter;
