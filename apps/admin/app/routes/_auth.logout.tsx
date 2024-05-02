import type { ActionFunctionArgs } from "@remix-run/node";
import { logout } from "~/modules/session.server";

export async function action({ request }: ActionFunctionArgs) {
  return logout(request);
}
