import { Button } from "@/ui/components/atoms/button";
import { Link, NavLink, Outlet } from "@remix-run/react";
import { ArrowLeftIcon } from "lucide-react";

const DashboardSettings = () => {
  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <Button asChild className="w-fit" variant="ghost">
          <Link to="/dashboard">
            <ArrowLeftIcon className="size-4 mr-2" />
            Dashboard
          </Link>
        </Button>
        <h1 className="text-3xl font-semibold">Settings</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav
          className="grid gap-4 text-sm text-muted-foreground"
          x-chunk="dashboard-04-chunk-0"
        >
          <NavLink
            className="aria-[current=page]:font-semibold"
            to="/dashboard/settings"
            end
          >
            General
          </NavLink>
          <NavLink
            className="aria-[current=page]:font-semibold"
            to="/dashboard/settings/account"
          >
            Account
          </NavLink>
          <NavLink
            className="aria-[current=page]:font-semibold"
            to="/dashboard/settings/plan"
          >
            Plan
          </NavLink>
          <NavLink
            className="aria-[current=page]:font-semibold"
            to="/dashboard/settings/developper"
          >
            Developper
          </NavLink>
        </nav>
        <Outlet />
      </div>
    </main>
  );
};

export default DashboardSettings;
