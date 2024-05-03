import { ClientOnly } from "@/ui/components/atoms/client-only";
import { cn } from "@/ui/lib/utils";
import { Outlet, useMatches } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeToogleForm } from "~/components/theme-toggle-form";

export default function AuthLayoutRoute() {
  const matches = useMatches();
  const { userPrefs } = matches[0].data as {
    userPrefs: {
      colorScheme: string;
    };
  };

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px] h-screen">
      <div className="flex border-r-full flex-col h-full">
        <header className="px-4 p-2 flex justify-between">
          <h1 className="text-xl flex items-center gap-2 font-semibold">
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
            TreasHunt
          </h1>
          <div>
            <ThemeToogleForm colorScheme={userPrefs.colorScheme} />
          </div>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center pt-8 pb-12 px-4">
          <Outlet />
        </div>
      </div>

      <div
        className={cn(
          "relative hidden overflow-hidden bg-muted lg:block",
          "after:absolute after:inset-0 after:bg-gradient-to-l after:from-primary after:to-primary/50 after:opacity-20 dark:after:bg-gradient-to-b dark:after:from-slate-900 dark:after:to-transparent dark:after:opacity-95",
        )}
      >
        <ClientOnly>
          {() => (
            <AnimatePresence>
              {userPrefs.colorScheme === "light" ? (
                <motion.div
                  key="light"
                  initial={{
                    y: -500,
                  }}
                  exit={{
                    y: -500,
                  }}
                  animate={{
                    y: 0,
                  }}
                  className={cn(
                    "absolute size-20 bg-yellow-200 left-1/2 top-24 rounded-full",
                    "shadow-[0_0px_100px_30px_rgb(250_250_100_/_0.75)]",
                  )}
                />
              ) : (
                <motion.div
                key="dark"
                  initial={{
                    y: -500,
                  }}
                  exit={{
                    y: -500,
                  }}
                  animate={{
                    y: 0,
                  }}
                  className={cn(
                    "z-50 opacity-90 absolute size-20 bg-gray-200 left-1/2 top-24 rounded-full",
                    "shadow-[0_0px_500px_200px_rgb(250_250_250_/_0.4)]",
                    "after:size-4 after:rounded-full after:absolute after:top-4 after:left-4 after:bg-gray-300",
                    "before:size-6 before:rounded-full before:absolute before:top-9 before:right-2 before:bg-gray-300/70",
                  )}
                />
              )}
            </AnimatePresence>
          )}
        </ClientOnly>
        <img
          src="/images/background.webp"
          alt="Background"
          className={cn(
            "h-full w-full object-cover dark:brightness-[0.5] dark:grayscale-[0.5] ",
          )}
        />
      </div>
    </div>
  );
}
