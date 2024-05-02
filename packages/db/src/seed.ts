import { PrismaClient } from "@prisma/client";

import bcrypt from "bcryptjs";

const db = new PrismaClient();

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const displayDeleteManyError = (e: any) => {
  console.error(e);
  // no worries if it doesn't exist yet
};

const cleanDB = async () => {
  // cleanup the existing database

  try {
    await db.user.deleteMany({
      where: {
        email: {
          not: {
            contains: "craftzoo",
          },
        },
      },
    });
    await db.scenario.deleteMany({});
  } catch (e) {
    displayDeleteManyError(e);
  }
};

const seed = async () => {
  console.info("Seeding database...");

  await cleanDB();

  try {
    const email = "craftzoo@admin.com";
    const hashedPassword = await bcrypt.hash("Sunsept", 10);

    const existingUser = await db.user.findFirst({
      where: {
        email,
      },
    });
    const user = existingUser
      ? existingUser
      : await db.user.create({
          data: {
            email,
            password: {
              create: {
                hash: hashedPassword,
              },
            },
            signupToken: {
              create: {
                verifiedAt: new Date(),
              },
            },
          },
        });

    const scenarios = await Promise.all(
      Array(10)
        .fill(0)
        .map(async (_, i) => {
          return await db.scenario.create({
            data: {
              name: `Scenario ${i + 1}`,
              slug: `scenario-${i + 1}`,
              description: `Description of scenario ${i + 1}`,
              author: {
                connect: {
                  id: user.id,
                },
              },
            },
          });
        }),
    );

    console.log(scenarios);
  } catch (e) {
    console.error(e);
  }

  console.info("Database has been seeded. 🌱");
};

await seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
