import path from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    clean: true, // Limpia el directorio de salida antes de cada build
    publicPath: "/", // Indica que el archivo debe ser servido desde la raíz
    library: "firedux",
    libraryTarget: "umd",
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "../examples/simple/index.html", // Ruta de tu archivo HTML de plantilla
      inject: "body", // Inyecta el script en el body
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"), // Servir archivos desde "dist"
    },
    port: 3000, // Cambia el puerto si lo prefieres
    open: true, // Abre el navegador automáticamente
    historyApiFallback: true, // Para manejar rutas en SPA
  },
};
