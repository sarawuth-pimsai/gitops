/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 242:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 465:
/***/ ((module) => {

module.exports = eval("require")("@actions/exec");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(242);
const exec = __nccwpck_require__(465);

const cmd = async (command, ...args) => {
  let output = "";
  let errors = "";
  let options = {
    silent: true,
  };
  options.listeners = {
    stdout: (data) => {
      output += data.toString();
    },
    stderr: (data) => {
      errors += data.toString();
    },
    ignoreReturnCode: true,
    silent: true,
  };
  await exec.exec(command, args, options).catch((err) => {
    core.info(`The command '${command} ${args.join(" ")}' failed: ${err}`);
  });
  if (errors !== "") {
    core.info(`stderr: ${errors}`);
  }
  return output;
};
const run = async () => {
  try {
    // let branch = (await cmd("git", "rev-parse", "HEAD")).trim();
    let branch = core.getInput("branch", { required: true });
    if (branch === "HEAD") {
      branch = (await cmd("git", "rev-parse", "HEAD")).trim();
    }
    const versionPattern = "v*[0-9].*[0-9].*[0-9]";
    // validate tag
    let tag;
    try {
      tag = await cmd(
        "git",
        "describe",
        "--tags",
        "--abbrev=0",
        `--match=${versionPattern}`,
        `${branch}~1`
      );
    } catch (error) {
      tag = "";
    }
    console.log("tag: ", tag);
    // Get root
    // Get branch
    // logs commit
    //
  } catch (error) {
    console.log(error);
    // core.error(error);
    // core.setFailed(error.message);
  }
};
run();

})();

module.exports = __webpack_exports__;
/******/ })()
;