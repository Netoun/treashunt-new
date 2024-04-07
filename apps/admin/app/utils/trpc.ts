import type { AppRouter } from "@treashunt/api";
import {
  createTRPCReact,
  inferReactQueryProcedureOptions,
} from "@trpc/react-query";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

// infer the types for your router
export type ReactQueryOptions = inferReactQueryProcedureOptions<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

export const trpc = createTRPCReact<AppRouter>();
