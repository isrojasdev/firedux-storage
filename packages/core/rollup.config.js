import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
import json from "@rollup/plugin-json";

export default {
  input: "src/index.js",
  output: [
    {
      file: "dist/index.js",
      format: "cjs", // CommonJS (para Node.js)
      sourcemap: true,
    },
    {
      file: "dist/index.esm.js",
      format: "es", // ESModules (para React y Vite)
      sourcemap: true,
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    json(),
    babel({ babelHelpers: "bundled" }),
    terser(), // Minifica el código
    nodeResolve({
      browser: true,
    }),
    commonjs({
      include: "node_modules/**",
    }),
  ],
  external: ["redux", "firebase"],
};
