const path = require("path");
const { config } = require("@rails/webpacker");

require("@babel/register")({
  extensions: [".es6", ".es", ".jsx", ".js", ".mjs", ".ts", ".tsx"],
  cwd: path.join(__dirname, "../.."),
  overrides: [
    {
      test: path.resolve(
        "./",
        config.source_path,
        config.source_entry_path,
        "electron",
      ),
      presets: [
        [
          "@babel/preset-env",
          {
            forceAllTransforms: true,
            useBuiltIns: "entry",
            corejs: 3,
            modules: "auto",
            exclude: ["transform-typeof-symbol"],
          },
        ],
      ],
    },
  ],
});
