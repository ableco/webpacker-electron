process.env.NODE_ENV = process.env.NODE_ENV || "production";

const path = require("path");
const { config } = require("@rails/webpacker");
const environment = require("../../environment");

Object.keys(environment.entry)
  .filter((key) => !key.startsWith("electron"))
  .forEach((entry) => {
    environment.entry.delete(entry);
  });

const electronConfig = {
  target: "electron-main",
  entry: {
    electron: path.resolve(
      config.source_path,
      config.source_entry_path,
      "electron/main.js",
    ),
  },
  output: {
    path: path.resolve(config.outputPath, "../", "packs-electron"),
    filename: "main.production.js",
  },
  node: {
    __dirname: false,
    __filename: false,
  },
};

environment.config.merge(electronConfig);

module.exports = environment.toWebpackConfig();
