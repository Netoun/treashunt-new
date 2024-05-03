import { Button } from "@/ui/components/atoms/button";
import { MoonIcon, SunIcon } from "@/ui/icons";
import { cn } from "@/ui/lib/utils";
import { useFetcher } from "@remix-run/react";

type ThemeToogleFormProps = {
  colorScheme: string;
};

export const ThemeToogleForm = ({ colorScheme }: ThemeToogleFormProps) => {
  const fetcher = useFetcher();

  return (
    <fetcher.Form
      id="theme-switcher-form"
      method="post"
      action="/app/set-theme"
    >
      <Button
        variant="ghost"
        type="submit"
        size="sm"
        name="theme"
        value={colorScheme === "dark" ? "light" : "dark"}
        className="relative rounded-full bg-muted items-center flex p-0 px-[0.05rem]"
        data-state={colorScheme}
      >
        <div className="flex items-center justify-center relative z-10 size-8 p-2">
          <SunIcon className="size-5" />
        </div>
        <div className="flex items-center justify-center relative z-10 size-8 p-2">
          <MoonIcon className="size-5" />
        </div>

        <div
          className={cn(
            "absolute size-7 p-2 rounded-full duration-150 [view-transition-name:dark-mode] motion-reduce:transition-none",
            colorScheme !== "dark"
              ? "-translate-x-4 bg-gradient-to-br from-yellow-100 to-yellow-400"
              : "translate-x-4 bg-gradient-to-r from-slate-400 to-slate-600",
          )}
        />
        <span className="sr-only">
          Toggle {colorScheme === "dark" ? "Light" : "Dark"} Mode
        </span>
      </Button>
    </fetcher.Form>
  );
};
