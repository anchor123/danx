import resolve from "@rollup/plugin-node-resolve";
import ts from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
import clear from "rollup-plugin-clear";
import { terser } from "rollup-plugin-terser";
import babel from "@rollup/plugin-babel";
import less from "rollup-plugin-less";
import alias from "@rollup/plugin-alias";
import { dts } from "rollup-plugin-dts";
import path from "path";

const production = !process.env.ROLLUP_WATCH;

const formats = production
  ? ["amd", "amd.min", "cjs", "es", "iife", "iife.min", "umd", "umd.min"]
  : ["iife"];

function getCamelCase(str) {
  let arr = str.split("-");
  return arr
    .map((item) => {
      return item.charAt(0).toUpperCase() + item.slice(1);
    })
    .join("");
}

export default [
  {
    input: !production ? "demo/index.ts" : "src/index.ts",
    output: formats.map((format) => {
      return {
        name: getCamelCase(require("./package.json").name),
        file: path.resolve(
          process.cwd(),
          `public/dist/index${
            format.includes("iife") ? format.replace("iife", "") : `.${format}`
          }.js`
        ),
        format: format.replace(".min", ""),
        sourcemap: true, // ts中的sourcemap也得变为true
        plugins: format.indexOf(".min") > -1 ? [terser()] : [],
      };
    }),
    plugins: [
      clear({
        targets: ["public/dist"],
      }),
      alias({
        entries: [{ find: "src", replacement: path.resolve(__dirname, "src") }],
      }),
      less({ output: "public/dist/index.css" }),
      resolve({
        browser: true,
        extensions: [".js", ".ts"],
      }),
      commonjs(),
      ts({
        tsconfig: path.resolve(__dirname, "tsconfig.json"),
      }),
      babel({
        babelrc: true,
        babelHelpers: "bundled",
        extensions: [".js", ".ts"],
      }),
    ],
    watch: {
      clearScreen: false,
    },
  },
  {
    input: "src/index.ts",
    output: {
      file: "public/dist/index.d.ts",
      format: "esm",
    },
    external: [],
    plugins: [dts({ respectExternal: true })],
  },
];
