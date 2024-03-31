import callsites from "callsites";
import _debug from "debug";

// import fs from "fs";
// import { dirname } from "path";
// import { fileURLToPath } from "url";

// if (process.env.NODE_ENV === "development") {
//   const currentModuleUrl = import.meta.url;
//   const currentModulePath = fileURLToPath(currentModuleUrl);
//   const currentDirectory = dirname(currentModulePath);
//   const logFilePath = currentDirectory + "/../../logs/debug.log";
//   var logStream = fs.createWriteStream(logFilePath, {
//     flags: "w",
//   });

//   // Handle errors on the stream
//   logStream.on("error", (error) => {
//     console.error("An error occurred:", error);
//   });
// }

const modifyDebug = (debug: _debug.Debugger) => {
  debug.enabled = true;

  //   if (process.env.NODE_ENV === "development") {
  //     debug.log = (data: string) => {
  //       logStream.write(data + "\n", "utf8");
  //     };
  //     debug.stream = logStream;
  //   } else {
  //     debug.stream = process.stdout;
  //   }

  const modifiedDebug: any = (...args: any[]) => {
    if (typeof args[0] == "object") {
      args.unshift("%O");
    }

    const message = args.shift();
    // const stack = callsites();
    // const caller = stack[1]; // Index 2 corresponds to the caller of this helper function
    // const filePath = caller.getFileName();
    // const file = filePath?.split("/").slice(-1)[0];
    // const line = caller.getLineNumber();

    debug(`${message}`, ...args);
  };

  for (const prop in debug) {
    if (debug.hasOwnProperty(prop)) {
      modifiedDebug[prop] = (debug as any)[prop];
    }
  }

  modifiedDebug._extend = modifiedDebug.extend;
  modifiedDebug.extend = function (...args: any[]) {
    const debug = modifiedDebug._extend(...args);
    return modifyDebug(debug);
  };

  return modifiedDebug;
};

const appBackendDebug = _debug("app");
const debug = modifyDebug(appBackendDebug);

export default debug;
