import { prisma } from "@treashunt/db";

type GetScenarioListParams = {
  authorId: string;
};

export const getScenarioList = async ({ authorId }: GetScenarioListParams) => {
  const scenarios = await prisma.scenario.findMany({
    include: {
      games: {
        select: {
          id: true,
          startedAt: true,
        },
      },
      puzzles: {
        select: {
          id: true,
        },
      },
    },
    where: {
      authorId,
    },
  });

  return scenarios;
};
