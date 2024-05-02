import { Prisma, PrismaClient } from "@prisma/client"

export const prisma = new PrismaClient()
export const { PrismaClientValidationError, PrismaClientKnownRequestError } =
  Prisma
export type * from "@prisma/client"

