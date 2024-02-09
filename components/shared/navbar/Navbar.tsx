import { SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import GlobalSearch from "../search/GlobalSearch";
import MoblieNav from "./MoblieNav";
import Theme from "./Theme";

const Navbar = () => {
  return (
    <nav className=" flex-between background-light900_dark200 fixed z-50 w-full gap-5 p-4 shadow-light-300 dark:shadow-none sm:px-12">
      <Link href="/" className="flex items-center gap-1">
        <p className=" h2-bold font-spaceGrotesk text-dark-100 dark:text-light-900">
          Dev <span className=" text-primary-500">Arena</span>
        </p>
      </Link>
      <GlobalSearch />
      <div className="flex-between gap-5">
        <Theme />
        <SignedIn>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-10 w-10",
              },
              variables: {
                colorPrimary: "#FF7000",
              },
            }}
          />
        </SignedIn>
        <MoblieNav />
      </div>
    </nav>
  );
};

export default Navbar;
