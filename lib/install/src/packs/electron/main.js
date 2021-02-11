/* eslint-disable no-console */
/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 */
import "core-js/stable";
import "regenerator-runtime/runtime";
import path from "path";
import { app, session, protocol, BrowserWindow, shell } from "electron";
import { autoUpdater } from "electron-updater";
import log from "electron-log";
import fs from "fs";
import { promisify } from "util";

const stat = promisify(fs.stat);

const FILE_NOT_FOUND = -6;

const getPath = async (path_) => {
  try {
    const result = await stat(path_);

    if (result.isFile()) {
      return path_;
    }

    if (result.isDirectory()) {
      return getPath(path.join(path_, "index.html"));
    }
  } catch (_) {}
};

function serve(baseOptions) {
  const options = Object.assign(
    {
      isCorsEnabled: true,
      scheme: "app",
    },
    baseOptions,
  );

  if (!options.directory) {
    throw new Error("The `directory` option is required");
  }

  options.directory = path.resolve(app.getAppPath(), options.directory);

  const handler = async (request, callback) => {
    const indexPath = path.join(options.directory, "index.html");
    const filePath = path.join(
      options.directory,
      decodeURIComponent(new URL(request.url).pathname),
    );
    const resolvedPath = await getPath(filePath);
    const fileExtension = path.extname(filePath);

    if (
      resolvedPath ||
      !fileExtension ||
      fileExtension === ".html" ||
      fileExtension === ".asar"
    ) {
      callback({
        path: resolvedPath || indexPath,
      });
    } else {
      callback({ error: FILE_NOT_FOUND });
    }
  };

  protocol.registerSchemesAsPrivileged([
    {
      scheme: options.scheme,
      privileges: {
        standard: true,
        secure: true,
        allowServiceWorkers: true,
        supportFetchAPI: true,
        corsEnabled: options.isCorsEnabled,
      },
    },
  ]);

  app.on("ready", () => {
    const protocolSession = options.partition
      ? session.fromPartition(options.partition)
      : session.defaultSession;

    protocolSession.protocol.registerFileProtocol(options.scheme, handler);
  });

  return async (window_) => {
    await window_.loadURL(`${options.scheme}://-`);
  };
}

const loadURL = serve({
  directory: ".",
});

export default class AppUpdater {
  constructor() {
    log.transports.file.level = "info";
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow = null;

if (process.env.NODE_ENV === "production") {
  const sourceMapSupport = require("source-map-support");
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === "development" ||
  process.env.DEBUG_PROD === "true"
) {
  require("electron-debug")();
}

const installExtensions = async () => {
  const installer = require("electron-devtools-installer");
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ["REACT_DEVELOPER_TOOLS"];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (
    process.env.NODE_ENV === "development" ||
    process.env.DEBUG_PROD === "true"
  ) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, "assets")
    : path.join(__dirname, "../assets");

  const getAssetPath = (...paths) => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath("icon.png"),
    webPreferences: {
      nodeIntegration: true,
      devTools: true,
    },
  });

  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:1212");
  } else {
    loadURL(mainWindow);
  }
  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on("did-finish-load", () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.webContents.session.clearStorageData();

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // Open urls in the user's browser
  mainWindow.webContents.on("new-window", (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on("window-all-closed", () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.whenReady().then(createWindow).catch(console.log);

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});
