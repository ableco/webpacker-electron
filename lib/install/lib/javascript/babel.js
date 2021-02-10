const path = require("path");

require("@babel/register")({
  extensions: [".es6", ".es", ".jsx", ".js", ".mjs", ".ts", ".tsx"],
  cwd: path.join(__dirname, "../.."),
  overrides: [
    {
      test: "./src/packs/electron",
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
