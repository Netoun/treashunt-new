import { PrismaClient } from "@prisma/client";

import bcrypt from "bcryptjs";

const db = new PrismaClient();

const displayDeleteManyError = (e: any) => {
  console.log(e);
  // no worries if it doesn't exist yet
};

const cleanDB = async () => {
  // cleanup the existing database
  
  try {
    await db.user.deleteMany({});
  } catch (e) {
    displayDeleteManyError(e);
  }
};

const seed = async () => {
  console.log(`Seeding database...`);

  await cleanDB();

  try {
    const email = "craftzoo@admin.com";
    const hashedPassword = await bcrypt.hash("Sunsept", 10);

    await db.user.create({
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
  } catch (e) {
    console.error(e);
  }

  console.log(`Database has been seeded. 🌱`);
};

await seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
