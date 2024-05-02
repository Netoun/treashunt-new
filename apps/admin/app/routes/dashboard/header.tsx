import { Button } from "@/ui/components/atoms/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/components/atoms/dropdown-menu";
import { Input } from "@/ui/components/atoms/input";
import { LogOutIcon, Search, Settings2Icon, User2Icon } from "@/ui/icons";
import { Link, useFetcher, useMatches } from "@remix-run/react";
import { ThemeToogleForm } from "~/components/theme-toggle-form";

export const DashboardHeader = () => {
  const fetcher = useFetcher({ key: "logout" });

  const matches = useMatches();
  const { userPrefs } = matches[0].data as {
    userPrefs: {
      colorScheme: string;
    };
  };

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="flex flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <img
            alt="logo"
            sizes="(max-width: 280px) 100vw, 280px"
            srcSet={`
                /images/chest,w_80.webp 80w,
                /images/chest,w_194.webp 194w,
                /images/chest,w_280.webp 280w
              `}
            src="/images/chest,w_280.webp"
            aria-hidden="true"
            className="w-8 h-8"
          />
          <span className="sr-only">Treashunt</span>
        </Link>
      </nav>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto ">
          <ThemeToogleForm colorScheme={userPrefs.colorScheme} />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <User2Icon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-40">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/dashboard/settings">
                <Settings2Icon className="size-4 mr-2" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() =>
                fetcher.submit({}, { method: "POST", action: "/logout" })
              }
            >
              <LogOutIcon className="size-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
