import { z } from "zod";
import { publicProcedure, router } from "../../trpc";
import { prisma } from "@treashunt/db";

export const adminRouter = router({
  getUser: publicProcedure.input(z.object({
    id: z.string(),
  })).query(({ input }) => {
    return prisma.user.findUnique({
      where: {
        id: input.id,
      },
    });
  }),
  getUsers: publicProcedure.query(() => {
    return prisma.user.findMany();
  }),
});

export type AdminRouter = typeof adminRouter;