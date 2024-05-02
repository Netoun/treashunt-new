import { Button } from "@/ui/components/atoms/button";
import { FormItem, FormMessage } from "@/ui/components/atoms/form";
import { Input } from "@/ui/components/atoms/input";
import { Label } from "@/ui/components/atoms/label";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, json, useFetcher } from "@remix-run/react";
import { adminService } from "@treashunt/business";
import { ArrowLeft, ArrowLeftIcon, CircleCheckIcon } from "lucide-react";
import { jsonWithError } from "remix-toast";
import { z } from "zod";

const schema = z.object({
  email: z.string({
    message: "Please enter a valid email address",
    invalid_type_error: "Please enter a valid email address",
    required_error: "Please enter your email address",
  }),
  password: z.string({
    message: "Please enter your password",
    required_error: "Please enter your password",
    invalid_type_error: "Please enter your password",
  }),
});

export const meta: MetaFunction = () => {
  return [{ title: "Treashunt - Register" }];
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const submission = parseWithZod(formData, {
    schema,
  });

  if (submission.status !== "success") {
    return json({ form: submission.reply(), user: null });
  }

  try {
    const user = await adminService.createUser(submission.value);

    if (!user) {
      throw new Error("An error occurred while creating your account");
    }

    return json({
      form: submission.reply(),
      user,
    });
  } catch (error) {
    console.error(error);

    return jsonWithError(
      {
        form: submission.reply(),
        user: null,
      },
      "An error occurred while creating your account. Please try again later.",
    );
  }
}

export default function AuthRegisterRoute() {
  const fetcher = useFetcher<typeof action>({
    key: "register",
  });

  const [form, fields] = useForm({
    lastResult: fetcher.data?.form,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: schema
          .extend({
            confirmPassword: z.string({
              message: "Please enter your password",
              required_error: "Please enter your password",
              invalid_type_error: "Please enter your password",
            }),
          })
          .refine(
            (data) => {
              return data.password === data.confirmPassword;
            },
            {
              message: "Passwords do not match",
              path: ["confirmPassword"],
            },
          ),
      });
    },
    shouldValidate: "onSubmit",
  });

  return (
    <div className="mx-auto grid gap-6 max-w-[350px]">
      {fetcher.data?.user ? (
        <>
          <div className="grid gap-2 justify-items-center text-center">
            <CircleCheckIcon className="text-success" size={48} />
            <h1 className="text-3xl font-semibold">Account created</h1>
            <p className="text-muted-foreground">
              Your account has been created successfully
            </p>
            <p className="text-muted-foreground">
              A confirmation email has been sent to your email address :{" "}
              <strong>{fetcher.data.user.email}</strong>
            </p>
          </div>
          <Link
            to="/login"
            className="inline-flex justify-center items-center underline text-center"
          >
            <ArrowLeftIcon className="inline-block size-4 mr-2" />
            Login
          </Link>
        </>
      ) : (
        <>
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Register</h1>
            <p className="text-muted-foreground">
              Enter your email below to register to your account
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
            <FormItem className="grid gap-2" field={fields.confirmPassword}>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="********"
                name={fields.confirmPassword.name}
                required
              />
              <FormMessage />
            </FormItem>
            <Button type="submit" className="w-full">
              Register
            </Button>
            <Button variant="outline" className="w-full">
              Register with Google
            </Button>
          </fetcher.Form>
          <div className="mt-4 text-center text-sm">
            Already have an account ?{" "}
            <Link to="/login" className="underline">
              Sign in
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
