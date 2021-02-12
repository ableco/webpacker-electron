process.env.NODE_ENV = process.env.NODE_ENV || "production";

const path = require("path");
const DotEnvPlugin = require("dotenv-webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { config } = require("@rails/webpacker");
const environment = require("../../environment");

Object.keys(environment.entry)
  .filter((key) => !key.match(/^electron/))
  .forEach((entry) => {
    environment.entry.delete(entry);
  });

const electronConfig = {
  target: "electron-renderer",
  entry: {
    electron: path.resolve(
      "./",
      config.source_path,
      config.source_entry_path,
      "electron/renderer.js",
    ),
  },
  output: {
    path: path.resolve(config.outputPath, "../", "packs-electron"),
    publicPath: "/packs-electron/",
    filename: "renderer.production.js",
  },
  plugins: [
    new DotEnvPlugin(),
    new HtmlWebpackPlugin({
      title: "Electron App",
      template: path.resolve(config.outputPath, "../", "electron.html"),
    }),
  ],
};

environment.config.merge(electronConfig);

module.exports = environment.toWebpackConfig();
