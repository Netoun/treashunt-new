import { watch } from "fs";
import dts from "bun-plugin-dts";

const watchOption = Bun.argv.find((arg) => arg === "--watch");

if (watchOption) {
  const watcher = watch(
    `${import.meta.dir}/src`,
    { recursive: true },
    async (event, filename) => {
      await build();
    },
  );
}

const build = async () => {
  console.log("Building common...");

  await Bun.build({
    entrypoints: ["./src/types.ts", "./src/utils.ts"],
    outdir: "./dist",
    plugins: [dts()],
    minify: process.env.NODE_ENV === "production",
  });
};

build();
