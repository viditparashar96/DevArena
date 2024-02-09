"use client";
import { HomePageFilters } from "@/constants/filters";
import { Button } from "../ui/button";

const HomeFilter = () => {
  const isActive = "";
  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex">
      {HomePageFilters.map((filter, index) => (
        <Button
          key={index}
          className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none ${isActive === filter.value ? " bg-primary-100 text-primary-500" : "dark:hover:bg-drak-300 bg-light-800 text-light-500 hover:bg-light-800 dark:bg-dark-500 dark:text-light-500"}`}
          onClick={() => console.log(filter)}
        >
          {filter.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilter;
