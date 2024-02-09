"use client";
import { Button } from "@/components/ui/button";
import { sidebarLinks } from "@/constants";
import { SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LeftSidebar = () => {
  const path = usePathname();
  return (
    <section className=" background-light900_dark200 custom-scrollbar light-border sticky left-0 top-0 flex h-screen flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]">
      <div className=" flex flex-1 flex-col">
        {sidebarLinks.map((item) => {
          const isActive =
            (path.includes(item.route) && item.route.length > 1) ||
            path === item.route;
          return (
            <div key={item.label}>
              <Link
                href={item.route}
                className={`${isActive ? "primary-gradient rounded-lg text-light-900" : "text-dark300_light900"}
              flex items-center justify-start gap-4 bg-transparent p-4
              `}
              >
                <p className={`${isActive ? "base-bold" : "base-medium"}`}>
                  {item.label}
                </p>
              </Link>
            </div>
          );
        })}
      </div>
      <SignedOut>
        <div className="flex flex-col gap-3">
          <div>
            <Link href="/sign-in">
              <Button className=" small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
                <span className=" text-primary-500"> Log In</span>
              </Button>
            </Link>
          </div>
          <div>
            <Link href="/sign-up">
              <Button className=" small-medium light-border-2 btn-tertiary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
                <span className=" text-primary-500"> Sign Up</span>
              </Button>
            </Link>
          </div>
        </div>
      </SignedOut>
    </section>
  );
};

export default LeftSidebar;
