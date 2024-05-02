import { watch } from "fs";
import { parseArgs } from "util";
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
  console.log("Building business...");

  await Bun.build({
    entrypoints: ["./src/index.ts"],
    outdir: "./dist",
    target: "node",
    plugins: [dts()],
  });
};

build();
