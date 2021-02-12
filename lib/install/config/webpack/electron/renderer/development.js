/* eslint-disable unicorn/no-process-exit */
process.env.NODE_ENV = process.env.NODE_ENV || "development";

const port = process.env.ELECTRON_PORT || 1212;
const publicPath = `http://localhost:${port}/`;

const path = require("path");
const { spawn } = require("child_process");
const webpack = require("webpack");
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
    publicPath,
    path: path.resolve(config.outputPath, "../", "packs-electron"),
    filename: "renderer.development.js",
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  plugins: [
    new DotEnvPlugin(),
    new webpack.LoaderOptionsPlugin({
      debug: true,
    }),
    new HtmlWebpackPlugin({
      title: "Electron App",
      template: path.resolve(config.outputPath, "../", "electron.html"),
    }),
  ],
  devServer: {
    port,
    publicPath,
    contentBase: path.resolve(config.outputPath, "../", "packs-electron"),
    historyApiFallback: {
      verbose: true,
      disableDotRule: false,
    },
    before() {
      console.log("Starting Main Process...");

      spawn("bin/rails", ["webpacker:start:electron:main"], {
        shell: true,
        env: process.env,
        stdio: "inherit",
      })
        .on("close", (code) => process.exit(code))
        .on("error", (spawnError) => console.error(spawnError));
    },
  },
};

environment.config.merge(electronConfig);

module.exports = environment.toWebpackConfig();
