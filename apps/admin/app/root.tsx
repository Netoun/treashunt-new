import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { httpBatchLink } from "@trpc/client"
import { useState } from "react"
import { getAuthCookie } from "~/utils/auth"
import { trpc } from "~/utils/trpc"
import superjson from "superjson"

import '@treashunt/ui/global.css'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          transformer: superjson,
          url: "http://localhost:3000/trpc",
          // You can pass any HTTP headers you wish here
          async headers() {
            return {
              authorization: getAuthCookie(),
            }
          },
        }),
      ],
    }),
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Outlet />
      </QueryClientProvider>
    </trpc.Provider>
  )
}

export function HydrateFallback() {
  return <p>Loading...</p>
}
