const path = require("path");
const { config } = require("@rails/webpacker");

require("@babel/register")({
  extensions: [".es6", ".es", ".jsx", ".js", ".mjs", ".ts", ".tsx"],
  cwd: path.join(__dirname, "../.."),
  overrides: [
    {
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
      plugins: [
        [
          "module-resolver",
          { root: [path.join(__dirname, "../..", config.source_path)] },
        ],
      ],
    },
  ],
});
