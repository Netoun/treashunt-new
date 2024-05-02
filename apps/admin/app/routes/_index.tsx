import type { MetaFunction } from "@remix-run/node"
import { trpc } from "~/utils/trpc"

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix SPA" },
    { name: "description", content: "Welcome to Remix (SPA Mode)!" },
  ]
}

export default function Index() {
  const { data: users, isLoading } = trpc.admin.getUsers.useQuery()

  return (
    <div className="p-4">
      {isLoading ? (
        "Loading..."
      ) : (
        <ul>
          {users?.map((user) => (
            <li key={user.id}>{user.email}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
