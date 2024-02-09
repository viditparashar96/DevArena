"use client";
import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { themes } from "@/constants";
import { useTheme } from "@/context/ThemeProvider";
import { MenubarItem } from "@radix-ui/react-menubar";

const Theme = () => {
  const { mode, setMode } = useTheme();
  return (
    <div>
      <Menubar className=" relative border-none bg-transparent shadow-none">
        <MenubarMenu>
          <MenubarTrigger className="focus:bg-light-900 data-[state=open]:bg-light-900 dark:focus:bg-dark-200 dark:data-[state=open]:bg-dark-200">
            {mode === "light" ? (
              <div className="flex items-center gap-2">
                <svg
                  className="active-theme size-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 5v14m0 0l3-3m-3 3l-3-3"
                  />
                </svg>
                <span>Dark</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <svg
                  className="active-theme size-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 5v14m0 0l3-3m-3 3l-3-3"
                  />
                </svg>
                <span>Light</span>
              </div>
            )}
          </MenubarTrigger>
          <MenubarContent className=" r-[-3rem] absolute mt-3 min-w-[120px] rounded border py-2 dark:border-dark-400 dark:bg-dark-300">
            {themes.map((theme) => (
              <MenubarItem
                key={theme.value}
                onClick={() => {
                  setMode(theme.value);
                  if (theme.value !== "system") {
                    localStorage.setItem("theme", theme.value);
                  } else {
                    localStorage.removeItem("theme");
                  }
                }}
                className={`${mode === theme.value && "active-theme"}`}
              >
                <p
                  className={`body-semibold ${mode === theme.value ? "text-primary-500" : "text-dark100_light900"}`}
                >
                  {theme.label}
                </p>
              </MenubarItem>
            ))}
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
};

export default Theme;
