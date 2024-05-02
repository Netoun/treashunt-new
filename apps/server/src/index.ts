import { Hono } from 'hono'
import { trpcServer } from '@hono/trpc-server' // Deno 'npm:@hono/trpc-server'
import { appRouter } from '@treashunt/api'
import { renderTrpcPanel } from 'trpc-panel'
import { cors } from 'hono/cors'

const app = new Hono()

app.use('/trpc/admin*', cors())


app.use(
  '/trpc/*',
  trpcServer({
    router: appRouter,
  })
)

// app.get("/panel", (res) => {
//   return res.render(renderTrpcPanel(appRouter, { url: "http://localhost:3000/trpc" }))
// });

export default app