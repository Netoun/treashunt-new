import { prisma } from "@treashunt/db";
import bcrypt from "bcryptjs";

export const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  return user;
};

export const getUserWithPasswordByEmail = async (email: string) => {
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
    include: {
      password: true,
    },
  });

  return user;
};

type CreateUserInput = {
  email: string;
  password: string;
};

export const createUser = async ({ email, password }: CreateUserInput) => {
  const hash = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash,
        },
      },
    },
  });
};

export const verifyUserMail = async (email: string) => {
  const user = await prisma.user.findFirst({
    where: {
      email,
      deletedAt: { equals: null },
    },
  });

  return user;
};

export const verifyUserSignupToken = async (signupTokenId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      signupToken: {
        id: signupTokenId,
      },
      deletedAt: { equals: null },
    },
    include: { signupToken: true },
  });

  if (!user || user.signupToken?.verifiedAt) return null;

  return prisma.signupToken.update({
    where: { id: signupTokenId },
    data: { verifiedAt: new Date() },
  });
};

export const remindUserPassword = async (email: string) => {
  const user = await prisma.user.findFirst({
    where: {
      email,
      deletedAt: { equals: null },
      signupToken: {
        verifiedAt: { not: null },
      },
    },
    include: { signupToken: true },
  });

  if (!user) return null;

  const resetPasswordToken = await prisma.resetPasswordToken.create({
    data: {
      user: { connect: { id: user.id } },
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
  });

  await prisma.resetPasswordToken.updateMany({
    where: {
      user: { id: user.id },
      id: { not: resetPasswordToken.id },
    },
    data: { expiresAt: new Date() },
  });

  return { ...user, resetPasswordToken };
};

export const checkUserResetPasswordToken = async (
  resetPasswordTokenId: string,
) =>
  await prisma.resetPasswordToken.findUnique({
    where: { id: resetPasswordTokenId, expiresAt: { gt: new Date() } },
  });

export const resetUserPassword = async (
  resetPasswordTokenId: string,
  password: string,
) => {
  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: {
        some: {
          id: resetPasswordTokenId,
          expiresAt: { gt: new Date() },
        },
      },
      deletedAt: { equals: null },
    },
    include: { resetPasswordToken: true },
  });

  if (!user) return null;

  const hash = await bcrypt.hash(password, 10);

  return prisma.user.update({
    where: { id: user.id },
    data: {
      password: {
        update: {
          hash,
        },
      },
      resetPasswordToken: {
        update: {
          data: { expiresAt: new Date() },
          where: { id: resetPasswordTokenId },
        },
      },
    },
  });
};
