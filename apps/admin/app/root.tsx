import { Toaster, toast as toastSonner } from "@/ui/components/atoms/sonner";
import { type LoaderFunctionArgs, json } from "@remix-run/node";
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
  useRouteLoaderData,
} from "@remix-run/react";
import { getToast } from "remix-toast";

import { ClientOnly } from "@/ui/components/atoms/client-only";
import { RocketIcon } from "@/ui/icons";
import "@treashunt/ui/global.css";
import { useEffect } from "react";
import { getCookieUserPrefs, userPrefsCookie } from "~/modules/cookie.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const userPrefs = await getCookieUserPrefs(request);

  const cookie = await userPrefsCookie.parse(request.headers.get("Cookie"));
  const { toast, headers } = await getToast(request);

  if (!cookie) {
    headers.append(
      "Set-Cookie",
      await userPrefsCookie.serialize({
        colorScheme: userPrefs.colorScheme,
        language: userPrefs.language,
      }),
    );
  }

  return json(
    { userPrefs, toast },
    {
      headers,
    },
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useRouteLoaderData<typeof loader>("root");

  useEffect(() => {
    if (data?.toast) {
      if (data.toast.type === "error") {
        toastSonner.error(data.toast.message);
      }
      if (data.toast.type === "success") {
        toastSonner.success(data.toast.message);
      }
    }
  }, [data?.toast]);

  const userPrefs = data ? data.userPrefs : { colorScheme: "light" };
  return (
    <html lang="en" className={userPrefs.colorScheme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <title>Treashunt</title>
        <meta
          name="description"
          content="Treashunt is a web application that allows you to create and play treasure hunts."
        />
        <Meta />
        <Links />
      </head>
      <body>
        <ClientOnly>
          {() => <Toaster closeButton duration={10000} />}
        </ClientOnly>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  return (
    <html lang="en">
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        {isRouteErrorResponse(error) && error.status === 404 ? (
          <div className="flex h-[100dvh] flex-col items-center justify-center bg-gray-100 px-4 dark:bg-gray-950">
            <div className="container mx-auto max-w-md space-y-6 text-center">
              <div className="relative h-[300px] w-full max-w-[400px]">
                <img
                  alt="Lost astronaut"
                  className="aspect-[4/3] w-full rounded-lg object-cover"
                  height="300"
                  src="/placeholder.svg"
                  width="400"
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-float">
                  <RocketIcon className="h-20 w-20 text-gray-500 dark:text-gray-400" />
                </div>
              </div>
              <div className="space-y-2">
                <h1 className="text-5xl font-bold tracking-tighter text-gray-900 dark:text-gray-50">
                  404
                </h1>
                <p className="text-lg text-gray-500 dark:text-gray-400">
                  Oops, the page you're looking for doesn't exist.
                </p>
                <Link
                  className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-6 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                  to="/"
                >
                  Go back home
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <h1>Oh no!</h1>
            <p>Something went wrong.</p>
          </div>
        )}
        <Scripts />
      </body>
    </html>
  );
}
