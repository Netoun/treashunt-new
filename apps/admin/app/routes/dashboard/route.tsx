import {
  type LoaderFunctionArgs,
  type MetaFunction,
  json,
  redirect,
} from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { getUser } from "~/modules/session.server";
import { DashboardHeader } from "~/routes/dashboard/header";

export const meta: MetaFunction = () => {
  return [
    { title: "Treashunt" },
    {
      name: "description",
      content:
        "Treashunt is a web application that allows you to create and play treasure hunts.",
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUser(request);

  if (!user) {
    return redirect("/login");
  }

  return json({ user });
};

export default function Dashboard() {
  return (
    <main>
      <DashboardHeader />
      <Outlet />
    </main>
  );
}
