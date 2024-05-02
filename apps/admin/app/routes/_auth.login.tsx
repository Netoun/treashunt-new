import { Button } from "@/ui/components/atoms/button";
import { FormItem, FormMessage } from "@/ui/components/atoms/form";
import { Input } from "@/ui/components/atoms/input";
import { Label } from "@/ui/components/atoms/label";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, json, useActionData, useFetcher } from "@remix-run/react";
import { z } from "zod";
import { createUserSession, login } from "~/modules/session.server";

const schema = z.object({
  email: z.string(),
  password: z.string(),
});

export const meta: MetaFunction = () => {
  return [{ title: "Treashunt - Login" }];
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const submission = parseWithZod(formData, { schema });

  if (submission.status !== "success") {
    return json(submission.reply());
  }

  const user = await login(submission.value);

  if (!user) {
    return json("Invalid email or password", { status: 401 });
  }

  return createUserSession({ request, userId: user.id });
}

export default function Login() {
  const lastResult = useActionData<typeof action>();

  const fetcher = useFetcher();

  const [form, fields] = useForm({
    lastResult: typeof lastResult === "string" ? undefined : lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
    shouldValidate: "onBlur",
  });

  return (
    <div className="mx-auto grid gap-6 max-w-[350px]">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
      <fetcher.Form
        method="post"
        id={form.id}
        className="grid gap-4"
        onSubmit={form.onSubmit}
      >
        <FormItem field={fields.email}>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            name={fields.email.name}
            required
          />
          <FormMessage />
        </FormItem>
        <FormItem className="grid gap-2" field={fields.password}>
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <Link
              to="/forgot-password"
              className="ml-auto inline-block text-sm underline"
            >
              Forgot your password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="********"
            name={fields.password.name}
            required
          />
          <FormMessage />
        </FormItem>
        <Button type="submit" className="w-full">
          Login
        </Button>
        <Button variant="outline" className="w-full">
          Login with Google
        </Button>
      </fetcher.Form>
      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}
