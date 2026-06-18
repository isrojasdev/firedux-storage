import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
import json from "@rollup/plugin-json";

export default {
  input: "src/index.js",
  watch: {
    clearScreen: false,
    include: 'src/**',
    buildDelay: 500,
    skipWrite: false
  },
  output: [
    {
      file: "dist/index.js",
      format: "cjs",
      exports: "named",
      sourcemap: true,
    },
    {
      file: "dist/index.esm.js",
      format: "es",
      exports: "named",
      sourcemap: true,
    },
  ],
  plugins: [
    resolve({
      browser: true,
    }),
    commonjs(),
    json(),
    babel({ babelHelpers: "bundled" }),
    terser(),
    commonjs({
      include: "node_modules/**",
    }),
  ],
  external: ["redux", "firebase"],
};
