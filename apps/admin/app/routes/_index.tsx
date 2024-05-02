import { Button } from "@/ui/components/atoms/button";
import { Input } from "@/ui/components/atoms/input";
import {
  type LoaderFunctionArgs,
  type MetaFunction,
  redirect,
} from "@remix-run/node";
import { getUser } from "~/modules/session.server";

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

  if (user) {
    return redirect("/dashboard");
  }

  return redirect("/login");
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <Button>Click me</Button>
      <Input />
    </div>
  );
}
