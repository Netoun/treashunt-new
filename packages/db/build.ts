// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import { watch } from "fs";
import dts from "bun-plugin-dts";

import { parseArgs } from "util";

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    watch: {
      type: "boolean",
    },
  },
  allowPositionals: true,
});

if (values.watch) {
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
    entrypoints: ["./src/index.ts"],
    outdir: "./dist",
    plugins: [dts()],
    minify: process.env.NODE_ENV === "production",
  });
};

build();
