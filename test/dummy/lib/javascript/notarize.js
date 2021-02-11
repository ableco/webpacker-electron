const { notarize } = require("electron-notarize");
const YAML = require("yaml");
const fs = require("fs");
const { promisify } = require("util");

const readFile = promisify(fs.readFile);

exports.default = async function notarizeMacOS(context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== "darwin") {
    return;
  }

  if (!process.env.CI) {
    console.warn("Skipping notarizing step. Packaging is not running in CI");
    return;
  }

  if (!("APPLE_ID" in process.env && "APPLE_ID_PASS" in process.env)) {
    console.warn(
      "Skipping notarizing step. APPLE_ID and APPLE_ID_PASS env variables must be set",
    );
    return;
  }

  const electronBuilderConfig = await readFile(
    "../../config/electron-builder.yml",
    "utf8",
  );
  const buildInfo = YAML.parse(electronBuilderConfig);

  const appName = context.packager.appInfo.productFilename;

  await notarize({
    appBundleId: buildInfo.appId,
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_ID_PASS,
  });
};
