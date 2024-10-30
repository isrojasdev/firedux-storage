import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: "./src/index.js", // Archivo de entrada para Webpack
  output: {
    filename: "main.js", // Archivo de salida
    path: path.resolve(__dirname, "dist"), // Carpeta de salida
    library: "firedux", // Nombre del objeto global
    libraryTarget: "umd", // Módulo Universal (UMD)
  },
  mode: "development", // Modo de compilación (development o production)
  module: {
    rules: [
      {
        test: /\.js$/, // Transpilar archivos JavaScript
        exclude: /node_modules/,
        use: {
          loader: "babel-loader", // Usar Babel para transpilar
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};
