// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/koji-tools/tools/wrapConsole.js":[function(require,module,exports) {
/**
 * koji_utilities/wrapConsole.js
 * 
 * What it Does:
 *   This utility wraps around the normal console.log() function
 *   in order to allow koji to display the logs from your app in
 *   the embedded preview within your editor. 
 * 
 * What to Change:
 *   This file is fairly complicated and deals with internal koji
 *   schemas about how to handle iframe postMessage's, so changing
 *   around how this works is not advisable.
 * 
 * How to Use:
 *   Import this file and run it as a function once your component
 *   has mounted, see common/App.js to see an implementation. This
 *   is already done for you in this project so don't worry about it.
 */

"use strict";

module.exports = () => {
  // Outgoing
  window.__originalConsole = {
    log: console.log.bind(console),
    info: console.info.bind(console),
    warn: console.warn.bind(console),
    error: console.error.bind(console),
  };

  try {
    const consoleOverrides = {
      // ...console,
      log: (...args) => {
        window.__originalConsole.log.apply(this, args);
        if (window.parent) {
            try {
              window.parent.postMessage({
                  action: 'log',
                  payload: { args },
              }, '*');
            } catch (err) {
                //
            }
        }
      },
      info: (...args) => {
        window.__originalConsole.info.apply(this, args);
        if (window.parent) {
          try {
              window.parent.postMessage({
                  action: 'info',
                  payload: { args },
              }, '*');
            } catch (err) {
                //
            }
        }
      },
      warn: (...args) => {
        window.__originalConsole.warn.apply(this, args);
        if (window.parent) {
          try {
              window.parent.postMessage({
                  action: 'warn',
                  payload: { args },
              }, '*');
            } catch (err) {
                //
            }
        }
      },
      error: (...args) => {
        window.__originalConsole.error.apply(this, args);
        if (window.parent) {
            try {
              window.parent.postMessage({
                  action: 'error',
                  payload: { args },
              }, '*');
            } catch (err) {
                //
            }
        }
      },
    };
    console = consoleOverrides;
  } catch (err) {
    //
  }

  // Wrap error
  window.onerror = (message, source, lineNumber) => {
      if (window.parent) {
          window.parent.postMessage({
              action: 'error',
              payload: {
                  args: [
                    message,
                    `In file: ${source}`,
                    `Line: ${lineNumber}`,
                  ],
              }
          }, '*');
      }
  };
};

},{}],"node_modules/parcel-bundler/src/builtins/_empty.js":[function(require,module,exports) {

},{}],"node_modules/ansi-colors-and-styles/index.js":[function(require,module,exports) {
/**
 * @author <a href="https://mirismaili.github.io">S. Mahdi Mir-Ismaili</a>.
 * Created on 1397/12/26 (2019/3/17).
 *
 * See: https://en.wikipedia.org/wiki/ANSI_escape_code
 */

// Colors and styles by [bodi0](https://stackoverflow.com/users/632524/bodi0):
//      https://stackoverflow.com/a/41407246/5318303

const RESET      =  '\x1b[0m';
const BRIGHT     =  '\x1b[1m';
const DIM        =  '\x1b[2m';
const UNDERSCORE =  '\x1b[4m';
const BLINK      =  '\x1b[5m';
const REVERSE    =  '\x1b[7m';
const HIDDEN     =  '\x1b[8m';

const FG_BLACK   = '\x1b[30m';
const FG_RED     = '\x1b[31m';
const FG_GREEN   = '\x1b[32m';
const FG_YELLOW  = '\x1b[33m';
const FG_BLUE    = '\x1b[34m';
const FG_MAGENTA = '\x1b[35m';
const FG_CYAN    = '\x1b[36m';
const FG_WHITE   = '\x1b[37m';

const BG_BLACK   = '\x1b[40m';
const BG_RED     = '\x1b[41m';
const BG_GREEN   = '\x1b[42m';
const BG_YELLOW  = '\x1b[43m';
const BG_BLUE    = '\x1b[44m';
const BG_MAGENTA = '\x1b[45m';
const BG_CYAN    = '\x1b[46m';
const BG_WHITE   = '\x1b[47m';
//------------------------------------------------------------------/

module.exports = {
	RESET      : RESET,
	BRIGHT     : BRIGHT,
	DIM        : DIM,
	UNDERSCORE : UNDERSCORE,
	BLINK      : BLINK,
	REVERSE    : REVERSE,
	HIDDEN     : HIDDEN,

	FG_BLACK   : FG_BLACK,
	FG_RED     : FG_RED,
	FG_GREEN   : FG_GREEN,
	FG_YELLOW  : FG_YELLOW,
	FG_BLUE    : FG_BLUE,
	FG_MAGENTA : FG_MAGENTA,
	FG_CYAN    : FG_CYAN,
	FG_WHITE   : FG_WHITE,

	BG_BLACK   : BG_BLACK,
	BG_RED     : BG_RED,
	BG_GREEN   : BG_GREEN,
	BG_YELLOW  : BG_YELLOW,
	BG_BLUE    : BG_BLUE,
	BG_MAGENTA : BG_MAGENTA,
	BG_CYAN    : BG_CYAN,
	BG_WHITE   : BG_WHITE,
    //------------------------------------------------------------------/

	T   : RESET,
	RS  : RESET,
	RT  : RESET,
	RST : RESET,

	B    : BRIGHT,
	BD   : BRIGHT,
	BR   : BRIGHT,
	BLD  : BRIGHT,
	BRT  : BRIGHT,
	BOLD : BRIGHT,

	I   : DIM,
	DM  : DIM,
    //DIM : DIM,

	U         : UNDERSCORE,
	UL        : UNDERSCORE,
	US        : UNDERSCORE,
	UNL       : UNDERSCORE,
	UNS       : UNDERSCORE,
	UNDERLINE : UNDERSCORE,

	N   : BLINK,
	BN  : BLINK,
	BNK : BLINK,

	V   : REVERSE,
	RV  : REVERSE,
	RVR : REVERSE,

	H   : HIDDEN,
	HN  : HIDDEN,
	HDN : HIDDEN,
    //------------------------------------------------------------------/

	K       : FG_BLACK,
	BK      : FG_BLACK,
	BLK     : FG_BLACK,
	BLACK   : FG_BLACK,

	R       : FG_RED,
	RD      : FG_RED,
	RED     : FG_RED,

	G       : FG_GREEN,
	GR      : FG_GREEN,
	GRN     : FG_GREEN,
	GREEN   : FG_GREEN,

	Y       : FG_YELLOW,
	YL      : FG_YELLOW,
	YLW     : FG_YELLOW,
	YELLOW  : FG_YELLOW,

	E       : FG_BLUE,
	BL      : FG_BLUE,
	BLU     : FG_BLUE,
	BLUE    : FG_BLUE,

	M       : FG_MAGENTA,
	MG      : FG_MAGENTA,
	MGN     : FG_MAGENTA,
	MAGENTA : FG_MAGENTA,

	C       : FG_CYAN,
	CN      : FG_CYAN,
	CYN     : FG_CYAN,
	CYAN    : FG_CYAN,

	W       : FG_WHITE,
	WT      : FG_WHITE,
	WHT     : FG_WHITE,
	WHITE   : FG_WHITE,
    //------------------------------------------------------------------/

	_K       : BG_BLACK,
	_BK      : BG_BLACK,
	_BLK     : BG_BLACK,
	_BLACK   : BG_BLACK,

	_R       : BG_RED,
	_RD      : BG_RED,
	_RED     : BG_RED,

	_G       : BG_GREEN,
	_GR      : BG_GREEN,
	_GRN     : BG_GREEN,
	_GREEN   : BG_GREEN,

	_Y       : BG_YELLOW,
	_YL      : BG_YELLOW,
	_YLW     : BG_YELLOW,
	_YELLOW  : BG_YELLOW,

	_E       : BG_BLUE,
	_BL      : BG_BLUE,
	_BLU     : BG_BLUE,
	_BLUE    : BG_BLUE,

	_M       : BG_MAGENTA,
	_MG      : BG_MAGENTA,
	_MGN     : BG_MAGENTA,
	_MAGENTA : BG_MAGENTA,

	_C       : BG_CYAN,
	_CN      : BG_CYAN,
	_CYN     : BG_CYAN,
	_CYAN    : BG_CYAN,

	_W       : BG_WHITE,
	_WT      : BG_WHITE,
	_WHT     : BG_WHITE,
	_WHITE   : BG_WHITE,
};

},{}],"node_modules/koji-tools/tools/readDirectory.js":[function(require,module,exports) {
const {execSync} = require('child_process')
const {_YLW, RED, RST} = require('ansi-colors-and-styles')
const path = require('path')

// Get all git-indexed paths to find koji files
module.exports = directory => {
   try {
      return execSync('git ls-files', {cwd: directory}).toString()
            .replace(/\n$/, '')
            .split('\n')
            .map(relativePath => path.resolve(directory, relativePath))
   } catch (error) {
      throw Error(error.message +
            `${_YLW}${RED}Have you installed "git" and added it to the "PATH"? If no see: ` +
            `https://git-scm.com/book/en/v2/Getting-Started-Installing-Git${RST}\n`
      )
   }
}

},{"child_process":"node_modules/parcel-bundler/src/builtins/_empty.js","ansi-colors-and-styles":"node_modules/ansi-colors-and-styles/index.js","path":"node_modules/parcel-bundler/src/builtins/_empty.js"}],"node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"node_modules/koji-tools/tools/findRootDirectory.js":[function(require,module,exports) {
var process = require("process");
const fs = require('fs')
const path = require('path')

module.exports = () => {
    // puts us in the directory where this is a node module of.
    let dirPath = process.cwd()
    
    // keep walking down the street.
    try {
        while (!fs.readdirSync(dirPath).includes('.koji')) {
            const parentPath = path.dirname(dirPath)
            if (dirPath === parentPath) // noinspection ExceptionCaughtLocallyJS
                throw Error(`Couldn't find ".koji" folder.`)
            dirPath = parentPath
        }
    } catch (err) {
        // give up and do a standard config
        dirPath = process.cwd()
        console.log(`Couldn't find ".koji" folder. Default path was used: "${dirPath}"`)
    }
    
    return dirPath
}

},{"fs":"node_modules/parcel-bundler/src/builtins/_empty.js","path":"node_modules/parcel-bundler/src/builtins/_empty.js","process":"node_modules/process/browser.js"}],"node_modules/koji-tools/tools/buildConfig.js":[function(require,module,exports) {
var process = require("process");
/**
 * buildConfig.js
 * 
 * What it does:
 *   This file takes all of the customization json files and wraps them
 *   into a single json string. It also packages route and page information
 *   from the backend and frontend directories.
 * 
 * Things to edit:
 *   Do not edit this file unless you really know what you're doing.
 *   If you have some complicated customization system that goes
 *   beyond what already exists you might have to change this
 *   file to include the customizations.
 */
const readDirectory = require('./readDirectory.js');

const findRootDirectory = require('./findRootDirectory.js');

const fs = require('fs');

module.exports = () => {
  let projectConfig = {
    pages: [],
    routes: []
  };
  let root = findRootDirectory();
  readDirectory(root).filter(path => (path.endsWith('koji.json') || path.includes('.koji')) && !path.includes('.koji-resources')).forEach(path => {
    try {
      const file = JSON.parse(fs.readFileSync(path, 'utf8'));
      Object.keys(file).forEach(key => {
        // If the key already exists in the project config, use it
        if (projectConfig[key]) {
          if (Array.isArray(projectConfig[key]) && Array.isArray(file[key])) {
            projectConfig[key] = projectConfig[key].concat(file[key]);
          } else {
            projectConfig[key] = Object.assign(projectConfig[key], file[key]);
          }
        } else {
          // Otherwise, set it
          projectConfig[key] = file[key];
        }
      }); // Create a map of backend routes by name

      projectConfig.backend = {};

      if (projectConfig.routes) {
        projectConfig.routes.forEach(({
          name,
          route
        }) => {
          projectConfig.backend[name] = `${undefined}${route}`;
        });
      }
    } catch (err) {//
    }
  });
  projectConfig.serviceMap = Object.keys(process.env).reduce((acc, cur) => {
    if (cur.startsWith('KOJI_SERVICE_URL')) {
      acc[cur.replace('KOJI_SERVICE_URL_', '').toLowerCase()] = process.env[cur];
    }

    return acc;
  }, {});
  return JSON.stringify(projectConfig);
};
},{"./readDirectory.js":"node_modules/koji-tools/tools/readDirectory.js","./findRootDirectory.js":"node_modules/koji-tools/tools/findRootDirectory.js","fs":"node_modules/parcel-bundler/src/builtins/_empty.js","process":"node_modules/process/browser.js"}],"node_modules/koji-tools/tools/buildRoutes.js":[function(require,module,exports) {
/**
 * koji_utilities/routes.js
 * 
 * What it Does:
 *   This function takes all of the backend route data and makes it easier to
 *   deal with. For use with koji_utilities/request.js, pass a route from the
 *   array that this file outputs in order to make a request to a backend route
 * 
 * Things to Change:
 *   This is a pretty simple utility that doesn't require or allow much customization.
 *   If you want to pass additional data from the koji.json file in your routes to
 *   request.js you can set that up in this file.
 */

module.exports = (config) => {
    let routeConfig = {};
    const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
    if (config.backend && config.routes && isBrowser) {
        const backendHost = window.location.host.replace('frontend', 'backend');
        routeConfig = config.routes.reduce((acc, { name, route, method, cache }) => {
            acc[name] = {
                url: config.backend[name],
                method,
                cache,
            };
            return acc;
        }, {});
    }
    return routeConfig;
}
},{}],"node_modules/koji-tools/tools/request.js":[function(require,module,exports) {
/**
 * koji_utilities/request.js
 * 
 * What it Does:
 *   This file provides a simplified way to send requests to the backend server. This is
 *   accomplished by wrapping a few more configuration options into the fetch function.
 *   Requests can be made to backend without this file but it is much easier with it.
 * 
 * What to Change:
 *   In Request we provide a very basic version of authorization and pushing a user to
 *   a /login page if they are not logged in. This authorization feature can be changed
 *   around or expanded if its needed. Also if you have any preference for what parameters
 *   should be used in fetch, you can define them here.
 */

// Parse JSON returned by a request
function parseJSON(response) {
  return response.json();
}

// Check the status of an HTTP request
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  return response
    .json()
    .then(({ error }) => {
        throw new Error(error || 'api_error');
    });
}

function wrapFetch(route, params) {
  let computedRoute = route.url;
  let cacheOptions = route.cache || 'no-cache';
  const computedOptions = {
    method: route.method.toLowerCase(),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    cache: cacheOptions,
  };

  // Replace all named parameters in the URL
  const mutableParams = params || {};
  Object.keys(mutableParams).forEach((key) => {
    if (computedRoute.indexOf(`:${key}`) !== -1) {
      computedRoute = computedRoute.replace(`:${key}`, encodeURIComponent(mutableParams[key]));
      delete mutableParams[key];
    }
  });

  // If it's a GET request, append all other params in the query string.
  // Otherwise, attach a JSON body to the POST request.
  if (route.method.toLowerCase() === 'get') {
    const queryParams = [];
    Object.keys(mutableParams).forEach((key) => queryParams.push(`${key}=${encodeURIComponent(mutableParams[key])}`));

    if (queryParams.length > 0) {
      computedRoute += `?${queryParams.join('&')}`;
    }
  } else {
    computedOptions.body = JSON.stringify(mutableParams.body);
  }

  // Process the request
  return fetch(computedRoute, computedOptions);
}

// Process an HTTP request
module.exports = (route, params) => {
  return wrapFetch(route, params)
    .then(checkStatus)
    .then(parseJSON)
    .catch((err) => {
      throw err;
    });
}

},{}],"node_modules/koji-tools/refresh.js":[function(require,module,exports) {
var __dirname = "C:\\Users\\User\\Projects\\baseball\\node_modules\\koji-tools";
var buildConfig = require('./tools/buildConfig.js');

module.exports = () => {
    var fs = require('fs');

    // escape our cached configs so koji editor can't store them
    var config = JSON.stringify({ config: JSON.parse(buildConfig()) }, null, 2);
    try {
        fs.writeFileSync(`${__dirname}/config.json`, config)
    } catch(err) {
        console.log(err);
    }
    console.log('new config');
}

},{"./tools/buildConfig.js":"node_modules/koji-tools/tools/buildConfig.js","fs":"node_modules/parcel-bundler/src/builtins/_empty.js"}],"node_modules/koji-tools/watch.js":[function(require,module,exports) {
var buildConfig = require('./tools/buildConfig.js');
var readDirectory = require('./tools/readDirectory.js');
var refresh = require('./refresh.js');
var findRootDirectory = require('./tools/findRootDirectory.js');

module.exports = () => {
    var fs = require('fs');
    console.log('koji-tools watching');
    // const props = JSON.parse(refresh());
    // output what the server wants us to in order to start the preview window
    // console.log(props.config.develop.frontend.events.built);
    // NOTE: figure out what to do about this one, because we cant output this before the server is ready...
 
    // make sure that its in there to start, postinstall has been doing so weird stuff
    refresh();
    // watch the .koji directory from a node_modules directory...
    let root = findRootDirectory();
    readDirectory(root)
        .filter(path => (path.endsWith('koji.json') || path.includes('.koji')) && !path.includes('.koji-resources'))
        .forEach((path) => {
            console.log('Watching', path);
            
            let fsWait = false;
            fs.access(path, fs.F_OK, (err) => {
                if (!err) {
                    fs.watch(path, (eventType, filename) => {
                        if (fsWait) return;
                        fsWait = setTimeout(() => {
                            fsWait = false;
                        }, 1000);
                        console.log(eventType, filename);
                        refresh();
                    });
                }
            });
        });
}

},{"./tools/buildConfig.js":"node_modules/koji-tools/tools/buildConfig.js","./tools/readDirectory.js":"node_modules/koji-tools/tools/readDirectory.js","./refresh.js":"node_modules/koji-tools/refresh.js","./tools/findRootDirectory.js":"node_modules/koji-tools/tools/findRootDirectory.js","fs":"node_modules/parcel-bundler/src/builtins/_empty.js"}],"node_modules/koji-tools/config.json":[function(require,module,exports) {
module.exports = {
  "config": {
    "pages": [],
    "routes": [],
    "colors": {
      "textColor": "#391a87",
      "rightPaddleColor": "#d404b3",
      "leftPaddleColor": "#01c4c8",
      "primaryColor": "#01c4c8"
    },
    "@@editor": [
      {
        "key": "colors",
        "name": "Colors",
        "icon": "💅",
        "source": "colors.json",
        "fields": [
          {
            "key": "textColor",
            "name": "Text color",
            "description": "Default color for text",
            "type": "color"
          },
          {
            "key": "rightPaddleColor",
            "name": "Right paddle color",
            "description": "Default color for right paddle",
            "type": "color"
          },
          {
            "key": "leftPaddleColor",
            "name": "Left paddle color",
            "description": "Default color for left paddle",
            "type": "color"
          },
          {
            "key": "primaryColor",
            "name": "Primary Color",
            "type": "color"
          }
        ]
      },
      {
        "key": "images",
        "name": "Images",
        "icon": "🖼️",
        "source": "images.json",
        "fields": [
          {
            "key": "backgroundImage",
            "name": "Background Image",
            "description": "Background image",
            "type": "image"
          },
          {
            "key": "ballImage",
            "name": "Ball Image",
            "description": "Ball image",
            "type": "image"
          },
          {
            "key": "player1Image",
            "name": "Player1 Image",
            "description": "Player1 image",
            "type": "image"
          },
          {
            "key": "player2Image",
            "name": "Player2 Image",
            "description": "Player2 image",
            "type": "image"
          }
        ]
      },
      {
        "key": "settings",
        "name": "Game settings",
        "icon": "🎮",
        "source": "settings.json",
        "fields": [
          {
            "key": "name",
            "name": "App name"
          },
          {
            "key": "startText",
            "name": "Start Button Text"
          },
          {
            "key": "player1WinText",
            "name": "Text to show when player 1 wins"
          },
          {
            "key": "player2WinText",
            "name": "Text to show when player 2 wins"
          },
          {
            "key": "instructionsMobile",
            "name": "How to play the game on mobile"
          },
          {
            "key": "instructionsDesktop",
            "name": "How to play the game on desktop"
          },
          {
            "key": "gameTopBar",
            "name": "If game should have a top bar or not"
          },
          {
            "key": "playerWidth",
            "name": "Width of players"
          },
          {
            "key": "playerHeight",
            "name": "Height of players"
          },
          {
            "key": "ballSize",
            "name": "Ball size"
          },
          {
            "key": "ballSpeed",
            "name": "Ball speed"
          },
          {
            "key": "difficulty",
            "name": "Difficulty level"
          },
          {
            "key": "winScore",
            "name": "Score need for player to win game"
          },
          {
            "key": "fontFamily",
            "name": "Font to use for text in the game"
          }
        ]
      },
      {
        "key": "sounds",
        "name": "Sounds",
        "icon": "🔊️",
        "source": "sounds.json",
        "fields": [
          {
            "key": "backgroundMusic",
            "name": "Background Music",
            "description": "Music to loop in background",
            "type": "sound"
          },
          {
            "key": "bounceSound",
            "name": "Bounce Sound",
            "description": "Sound to play on bounce",
            "type": "sound"
          },
          {
            "key": "scoreSound",
            "name": "Score Sound",
            "description": "Sound to play on score",
            "type": "sound"
          }
        ]
      }
    ],
    "backend": {},
    "images": {
      "backgroundImage": "https://objects.koji-cdn.com/e46e3eb9-9d82-4ce4-92ca-1470ea5f937f/kyrbo-baseballfield.svg",
      "ballImage": "https://images.koji-cdn.com/e46e3eb9-9d82-4ce4-92ca-1470ea5f937f/jzg3w-9f8911eedfc246a684f43eaae9bb25e2.png",
      "player1Image": "https://objects.koji-cdn.com/e46e3eb9-9d82-4ce4-92ca-1470ea5f937f/0fsfy-baseballbeat.svg",
      "player2Image": "https://images.koji-cdn.com/e46e3eb9-9d82-4ce4-92ca-1470ea5f937f/vafxb-baseballglove.png"
    },
    "settings": {
      "name": "Baseball Catcher",
      "startText": "Start",
      "player1WinText": "Player 1 Wins!",
      "player2WinText": "Player 2 Wins!",
      "instructionsMobile": "Tap to launch ball. Swipe up or down to move [ ⇡ ⇣ ]",
      "instructionsDesktop": "Player 1: Spacebar to launch. [ ⇡ ⇣ ] to move. Player 2: [ W S ] to move.",
      "gameTopBar": true,
      "playerWidth": 10,
      "playerHeight": 60,
      "ballSize": 20,
      "ballSpeed": 20,
      "difficulty": 5,
      "winScore": 5,
      "fontFamily": "Bungee Inline"
    },
    "sounds": {
      "backgroundMusic": "https://objects.koji-cdn.com/346c4884-64f9-4fb5-89b5-8fe031ed672c/pongsynth2.mp3",
      "bounceSound": "https://objects.koji-cdn.com/d659a1cd-54ca-41c1-906f-3b7b5f6aeb7d/scoreSound.mp3",
      "scoreSound": "https://objects.koji-cdn.com/d659a1cd-54ca-41c1-906f-3b7b5f6aeb7d/winSound.mp3"
    },
    "deploy": {
      "subdomain": ".withkoji.com",
      "frontend": {
        "output": "dist",
        "commands": [
          "npm install",
          "npm run build"
        ],
        "injections": []
      }
    },
    "develop": {
      "frontend": {
        "path": ".",
        "port": 1234,
        "events": {
          "started": "npm start",
          "building": "node config.js",
          "built": "Built in",
          "build-error": "npm ERR!"
        },
        "startCommand": "npm start"
      }
    },
    "serviceMap": {}
  }
};
},{}],"node_modules/koji-tools/index.js":[function(require,module,exports) {
var global = arguments[3];
var process = require("process");
"use strict";

var wrapConsole = require('./tools/wrapConsole.js');

var buildConfig = require('./tools/buildConfig.js');

var buildRoutes = require('./tools/buildRoutes.js'); // var attachVCCTest = require('./tools/vccTest.js');


var request = require('./tools/request.js');

var watch = require('./watch.js');

if (!global.kojiCallbacks) global.kojiCallbacks;
if (!global.pwaInstall) global.pwaInstall;

function pageLoad(options) {
  if ("development" !== 'production') {
    wrapConsole();
    window.addEventListener('message', ({
      data
    }) => {
      // Global context injection
      if (data.action === 'injectGlobal') {
        const {
          scope,
          key,
          value
        } = data.payload;
        var temp = JSON.parse(window.localStorage.getItem('koji'));
        temp[scope][key] = value;
        exports.config[scope][key] = value;
        exports.routes = buildRoutes(exports.config);
        window.localStorage.setItem('koji', JSON.stringify(temp)); // update our hooks for an onchange event.

        callEvent('change', [scope, key, value]);
      }
    }, false); //
    // attachVCCTest(getConfig());
  } else {
    // attempt to load a service worker...?
    const sw = require('./serviceWorker.js');

    sw.register();
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      global.pwaInstall = e;
      callEvent('pwaPromptReady');
    });
  }

  window.localStorage.setItem('koji', JSON.stringify(getConfig()));
  exports.config = getConfig();
  exports.routes = buildRoutes(exports.config);
}

function getConfig() {
  return require('./config.json').config;
}

function on(event, callback) {
  if (!global.kojiCallbacks) global.kojiCallbacks = {};
  if (!global.kojiCallbacks[event]) global.kojiCallbacks[event] = [];
  global.kojiCallbacks[event].push(callback);
}

function callEvent(event, params) {
  if (global.kojiCallbacks && global.kojiCallbacks[event]) {
    global.kojiCallbacks[event].forEach(callback => callback.apply(null, params));
  }
}

exports.config = getConfig();
exports.routes = buildRoutes(exports.config);
exports.pageLoad = pageLoad;
exports.watch = watch;
exports.request = request;
exports.on = on;
exports.pwa = global.pwaInstall;

exports.pwaPrompt = () => global.pwaInstall.prompt();

exports.resolveSecret = key => {
  if (!process || !process.env || !undefined) {
    return null;
  }

  try {
    const parsedSecrets = JSON.parse(undefined);
    return parsedSecrets[key] || null;
  } catch (err) {//
  }

  return null;
};
},{"./tools/wrapConsole.js":"node_modules/koji-tools/tools/wrapConsole.js","./tools/buildConfig.js":"node_modules/koji-tools/tools/buildConfig.js","./tools/buildRoutes.js":"node_modules/koji-tools/tools/buildRoutes.js","./tools/request.js":"node_modules/koji-tools/tools/request.js","./watch.js":"node_modules/koji-tools/watch.js","./config.json":"node_modules/koji-tools/config.json","process":"node_modules/process/browser.js"}],"game/helpers/animationframe.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cancelAnimationFrame = exports.requestAnimationFrame = void 0;

/**
 * game/helpers/animationframe.js
 * 
 * What it Does:
 *   This file exports requestAnimationFrame and cancelAnimationFrame
 *   for the major browsers
 * 
 *   requestAnimationFrame: takes a function we want to run.
 *   in the case of this game play() runs the function when the browser is ready
 *   and returns an integer representing the times it has been called.
 *   this way the game can keep track of frames and not continue calling play()
 *   when the browser is not in focus. The browser allows a new frame about every 60 seconds.
 * 
 *   checkout the requestFrame method in game/main.js that extends requestAnimationFrame
 * 
 *   cancelAnimationFrame: takes the frame number and cancels the animation
 *   checkout the cancelFrame method in game/main.js that extends cancelAnimationFrame
 * 
 * Learn more:
 *   https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
 *   https://developer.mozilla.org/en-US/docs/Games/Techniques/Efficient_animation_for_web_games
 * 
 */
var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
exports.requestAnimationFrame = requestAnimationFrame;
var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
exports.cancelAnimationFrame = cancelAnimationFrame;
},{}],"node_modules/audio-context/index.js":[function(require,module,exports) {
'use strict'

var cache = {}

module.exports = function getContext (options) {
	if (typeof window === 'undefined') return null
	
	var OfflineContext = window.OfflineAudioContext || window.webkitOfflineAudioContext
	var Context = window.AudioContext || window.webkitAudioContext
	
	if (!Context) return null

	if (typeof options === 'number') {
		options = {sampleRate: options}
	}

	var sampleRate = options && options.sampleRate


	if (options && options.offline) {
		if (!OfflineContext) return null

		return new OfflineContext(options.channels || 2, options.length, sampleRate || 44100)
	}


	//cache by sampleRate, rather strong guess
	var ctx = cache[sampleRate]

	if (ctx) return ctx

	//several versions of firefox have issues with the
	//constructor argument
	//see: https://bugzilla.mozilla.org/show_bug.cgi?id=1361475
	try {
		ctx = new Context(options)
	}
	catch (err) {
		ctx = new Context()
	}
	cache[ctx.sampleRate] = cache[sampleRate] = ctx

	return ctx
}

},{}],"node_modules/audio-loader/lib/base64.js":[function(require,module,exports) {
'use strict'

// DECODE UTILITIES
function b64ToUint6 (nChr) {
  return nChr > 64 && nChr < 91 ? nChr - 65
    : nChr > 96 && nChr < 123 ? nChr - 71
    : nChr > 47 && nChr < 58 ? nChr + 4
    : nChr === 43 ? 62
    : nChr === 47 ? 63
    : 0
}

// Decode Base64 to Uint8Array
// ---------------------------
function decode (sBase64, nBlocksSize) {
  var sB64Enc = sBase64.replace(/[^A-Za-z0-9\+\/]/g, '')
  var nInLen = sB64Enc.length
  var nOutLen = nBlocksSize
    ? Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize
    : nInLen * 3 + 1 >> 2
  var taBytes = new Uint8Array(nOutLen)

  for (var nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) {
    nMod4 = nInIdx & 3
    nUint24 |= b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 18 - 6 * nMod4
    if (nMod4 === 3 || nInLen - nInIdx === 1) {
      for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) {
        taBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255
      }
      nUint24 = 0
    }
  }
  return taBytes
}

module.exports = { decode: decode }

},{}],"node_modules/is-buffer/index.js":[function(require,module,exports) {
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}

},{}],"node_modules/audio-loader/lib/load.js":[function(require,module,exports) {
'use strict'

var base64 = require('./base64')
var isBuffer = require('is-buffer')

// Given a regex, return a function that test if against a string
function fromRegex (r) {
  return function (o) { return typeof o === 'string' && r.test(o) }
}
// Try to apply a prefix to a name
function prefix (pre, name) {
  return typeof pre === 'string' ? pre + name
    : typeof pre === 'function' ? pre(name)
    : name
}

/**
 * Load one or more audio files
 *
 *
 * Possible option keys:
 *
 * - __from__ {Function|String}: a function or string to convert from file names to urls.
 * If is a string it will be prefixed to the name:
 * `load('snare.mp3', { from: 'http://audio.net/samples/' })`
 * If it's a function it receives the file name and should return the url as string.
 * - __only__ {Array} - when loading objects, if provided, only the given keys
 * will be included in the decoded object:
 * `load('piano.json', { only: ['C2', 'D2'] })`
 *
 * @param {Object} source - the object to be loaded
 * @param {Object} options - (Optional) the load options for that object
 * @param {Object} defaultValue - (Optional) the default value to return as
 * in a promise if not valid loader found
 */
function load (source, options, defVal) {
  var loader =
    // Basic audio loading
      isArrayBuffer(source) || isBuffer(source) ? decodeBuffer
    : isAudioFileName(source) ? loadAudioFile
    : isPromise(source) ? loadPromise
    // Compound objects
    : isArray(source) ? loadArrayData
    : isObject(source) ? loadObjectData
    : isJsonFileName(source) ? loadJsonFile
    // Base64 encoded audio
    : isBase64Audio(source) ? loadBase64Audio
    : isJsFileName(source) ? loadMidiJSFile
    : null

  var opts = options || {}
  var promise = loader ? loader(source, opts)
    : defVal ? Promise.resolve(defVal)
    : Promise.reject('Source not valid (' + source + ')')

  return promise.then(function (data) {
    opts.ready(null, data)
    return data
  }, function (err) {
    opts.ready(err)
    throw err
  })
}

// BASIC AUDIO LOADING
// ===================

// Load (decode) an array buffer
function isArrayBuffer (o) { return o instanceof ArrayBuffer }
function decodeBuffer (array, options) {
  return options.decode(array)
}

// Load an audio filename
var isAudioFileName = fromRegex(/\.(mp3|wav|ogg)(\?.*)?$/i)
function loadAudioFile (name, options) {
  var url = prefix(options.from, name)
  return load(options.fetch(url, 'arraybuffer'), options)
}

// Load the result of a promise
function isPromise (o) { return o && typeof o.then === 'function' }
function loadPromise (promise, options) {
  return promise.then(function (value) {
    return load(value, options)
  })
}

// COMPOUND OBJECTS
// ================

// Try to load all the items of an array
var isArray = Array.isArray
function loadArrayData (array, options) {
  return Promise.all(array.map(function (data) {
    return load(data, options, data)
  }))
}

// Try to load all the values of a key/value object
function isObject (o) { return o && typeof o === 'object' }
function loadObjectData (obj, options) {
  var dest = {}
  var promises = Object.keys(obj).map(function (key) {
    if (options.only && options.only.indexOf(key) === -1) return null
    var value = obj[key]
    return load(value, options, value).then(function (audio) {
      dest[key] = audio
    })
  })
  return Promise.all(promises).then(function () { return dest })
}

// Load the content of a JSON file
var isJsonFileName = fromRegex(/\.json(\?.*)?$/i)
function loadJsonFile (name, options) {
  var url = prefix(options.from, name)
  return load(options.fetch(url, 'text').then(JSON.parse), options)
}

// BASE64 ENCODED FORMATS
// ======================

// Load strings with Base64 encoded audio
var isBase64Audio = fromRegex(/^data:audio/)
function loadBase64Audio (source, options) {
  var i = source.indexOf(',')
  return load(base64.decode(source.slice(i + 1)).buffer, options)
}

// Load .js files with MidiJS soundfont prerendered audio
var isJsFileName = fromRegex(/\.js(\?.*)?$/i)
function loadMidiJSFile (name, options) {
  var url = prefix(options.from, name)
  return load(options.fetch(url, 'text').then(midiJsToJson), options)
}

// convert a MIDI.js javascript soundfont file to json
function midiJsToJson (data) {
  var begin = data.indexOf('MIDI.Soundfont.')
  if (begin < 0) throw Error('Invalid MIDI.js Soundfont format')
  begin = data.indexOf('=', begin) + 2
  var end = data.lastIndexOf(',')
  return JSON.parse(data.slice(begin, end) + '}')
}

if (typeof module === 'object' && module.exports) module.exports = load
if (typeof window !== 'undefined') window.loadAudio = load

},{"./base64":"node_modules/audio-loader/lib/base64.js","is-buffer":"node_modules/is-buffer/index.js"}],"node_modules/audio-loader/lib/browser.js":[function(require,module,exports) {
/* global XMLHttpRequest */
'use strict'
var load = require('./load')
var context = require('audio-context')

module.exports = function (source, options, cb) {
  if (options instanceof Function) {
    cb = options
    options = {}
  }
  options = options || {}
  options.ready = cb || function () {}
  var ac = options && options.context ? options.context : context()
  var defaults = { decode: getAudioDecoder(ac), fetch: fetch }
  var opts = Object.assign(defaults, options)
  return load(source, opts)
}

/**
 * Wraps AudioContext's decodeAudio into a Promise
 */
function getAudioDecoder (ac) {
  return function decode (buffer) {
    return new Promise(function (resolve, reject) {
      ac.decodeAudioData(buffer,
        function (data) { resolve(data) },
        function (err) { reject(err) })
    })
  }
}

/*
 * Wraps a XMLHttpRequest into a Promise
 *
 * @param {String} url
 * @param {String} type - can be 'text' or 'arraybuffer'
 * @return {Promise}
 */
function fetch (url, type) {
  return new Promise(function (resolve, reject) {
    var req = new XMLHttpRequest()
    if (type) req.responseType = type

    req.open('GET', url)
    req.onload = function () {
      req.status === 200 ? resolve(req.response) : reject(Error(req.statusText))
    }
    req.onerror = function () { reject(Error('Network Error')) }
    req.send()
  })
}

},{"./load":"node_modules/audio-loader/lib/load.js","audio-context":"node_modules/audio-context/index.js"}],"node_modules/webfontloader/webfontloader.js":[function(require,module,exports) {
var define;
/* Web Font Loader v1.6.28 - (c) Adobe Systems, Google. License: Apache 2.0 */(function(){function aa(a,b,c){return a.call.apply(a.bind,arguments)}function ba(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}function p(a,b,c){p=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?aa:ba;return p.apply(null,arguments)}var q=Date.now||function(){return+new Date};function ca(a,b){this.a=a;this.o=b||a;this.c=this.o.document}var da=!!window.FontFace;function t(a,b,c,d){b=a.c.createElement(b);if(c)for(var e in c)c.hasOwnProperty(e)&&("style"==e?b.style.cssText=c[e]:b.setAttribute(e,c[e]));d&&b.appendChild(a.c.createTextNode(d));return b}function u(a,b,c){a=a.c.getElementsByTagName(b)[0];a||(a=document.documentElement);a.insertBefore(c,a.lastChild)}function v(a){a.parentNode&&a.parentNode.removeChild(a)}
function w(a,b,c){b=b||[];c=c||[];for(var d=a.className.split(/\s+/),e=0;e<b.length;e+=1){for(var f=!1,g=0;g<d.length;g+=1)if(b[e]===d[g]){f=!0;break}f||d.push(b[e])}b=[];for(e=0;e<d.length;e+=1){f=!1;for(g=0;g<c.length;g+=1)if(d[e]===c[g]){f=!0;break}f||b.push(d[e])}a.className=b.join(" ").replace(/\s+/g," ").replace(/^\s+|\s+$/,"")}function y(a,b){for(var c=a.className.split(/\s+/),d=0,e=c.length;d<e;d++)if(c[d]==b)return!0;return!1}
function ea(a){return a.o.location.hostname||a.a.location.hostname}function z(a,b,c){function d(){m&&e&&f&&(m(g),m=null)}b=t(a,"link",{rel:"stylesheet",href:b,media:"all"});var e=!1,f=!0,g=null,m=c||null;da?(b.onload=function(){e=!0;d()},b.onerror=function(){e=!0;g=Error("Stylesheet failed to load");d()}):setTimeout(function(){e=!0;d()},0);u(a,"head",b)}
function A(a,b,c,d){var e=a.c.getElementsByTagName("head")[0];if(e){var f=t(a,"script",{src:b}),g=!1;f.onload=f.onreadystatechange=function(){g||this.readyState&&"loaded"!=this.readyState&&"complete"!=this.readyState||(g=!0,c&&c(null),f.onload=f.onreadystatechange=null,"HEAD"==f.parentNode.tagName&&e.removeChild(f))};e.appendChild(f);setTimeout(function(){g||(g=!0,c&&c(Error("Script load timeout")))},d||5E3);return f}return null};function B(){this.a=0;this.c=null}function C(a){a.a++;return function(){a.a--;D(a)}}function E(a,b){a.c=b;D(a)}function D(a){0==a.a&&a.c&&(a.c(),a.c=null)};function F(a){this.a=a||"-"}F.prototype.c=function(a){for(var b=[],c=0;c<arguments.length;c++)b.push(arguments[c].replace(/[\W_]+/g,"").toLowerCase());return b.join(this.a)};function G(a,b){this.c=a;this.f=4;this.a="n";var c=(b||"n4").match(/^([nio])([1-9])$/i);c&&(this.a=c[1],this.f=parseInt(c[2],10))}function fa(a){return H(a)+" "+(a.f+"00")+" 300px "+I(a.c)}function I(a){var b=[];a=a.split(/,\s*/);for(var c=0;c<a.length;c++){var d=a[c].replace(/['"]/g,"");-1!=d.indexOf(" ")||/^\d/.test(d)?b.push("'"+d+"'"):b.push(d)}return b.join(",")}function J(a){return a.a+a.f}function H(a){var b="normal";"o"===a.a?b="oblique":"i"===a.a&&(b="italic");return b}
function ga(a){var b=4,c="n",d=null;a&&((d=a.match(/(normal|oblique|italic)/i))&&d[1]&&(c=d[1].substr(0,1).toLowerCase()),(d=a.match(/([1-9]00|normal|bold)/i))&&d[1]&&(/bold/i.test(d[1])?b=7:/[1-9]00/.test(d[1])&&(b=parseInt(d[1].substr(0,1),10))));return c+b};function ha(a,b){this.c=a;this.f=a.o.document.documentElement;this.h=b;this.a=new F("-");this.j=!1!==b.events;this.g=!1!==b.classes}function ia(a){a.g&&w(a.f,[a.a.c("wf","loading")]);K(a,"loading")}function L(a){if(a.g){var b=y(a.f,a.a.c("wf","active")),c=[],d=[a.a.c("wf","loading")];b||c.push(a.a.c("wf","inactive"));w(a.f,c,d)}K(a,"inactive")}function K(a,b,c){if(a.j&&a.h[b])if(c)a.h[b](c.c,J(c));else a.h[b]()};function ja(){this.c={}}function ka(a,b,c){var d=[],e;for(e in b)if(b.hasOwnProperty(e)){var f=a.c[e];f&&d.push(f(b[e],c))}return d};function M(a,b){this.c=a;this.f=b;this.a=t(this.c,"span",{"aria-hidden":"true"},this.f)}function N(a){u(a.c,"body",a.a)}function O(a){return"display:block;position:absolute;top:-9999px;left:-9999px;font-size:300px;width:auto;height:auto;line-height:normal;margin:0;padding:0;font-variant:normal;white-space:nowrap;font-family:"+I(a.c)+";"+("font-style:"+H(a)+";font-weight:"+(a.f+"00")+";")};function P(a,b,c,d,e,f){this.g=a;this.j=b;this.a=d;this.c=c;this.f=e||3E3;this.h=f||void 0}P.prototype.start=function(){var a=this.c.o.document,b=this,c=q(),d=new Promise(function(d,e){function f(){q()-c>=b.f?e():a.fonts.load(fa(b.a),b.h).then(function(a){1<=a.length?d():setTimeout(f,25)},function(){e()})}f()}),e=null,f=new Promise(function(a,d){e=setTimeout(d,b.f)});Promise.race([f,d]).then(function(){e&&(clearTimeout(e),e=null);b.g(b.a)},function(){b.j(b.a)})};function Q(a,b,c,d,e,f,g){this.v=a;this.B=b;this.c=c;this.a=d;this.s=g||"BESbswy";this.f={};this.w=e||3E3;this.u=f||null;this.m=this.j=this.h=this.g=null;this.g=new M(this.c,this.s);this.h=new M(this.c,this.s);this.j=new M(this.c,this.s);this.m=new M(this.c,this.s);a=new G(this.a.c+",serif",J(this.a));a=O(a);this.g.a.style.cssText=a;a=new G(this.a.c+",sans-serif",J(this.a));a=O(a);this.h.a.style.cssText=a;a=new G("serif",J(this.a));a=O(a);this.j.a.style.cssText=a;a=new G("sans-serif",J(this.a));a=
O(a);this.m.a.style.cssText=a;N(this.g);N(this.h);N(this.j);N(this.m)}var R={D:"serif",C:"sans-serif"},S=null;function T(){if(null===S){var a=/AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(window.navigator.userAgent);S=!!a&&(536>parseInt(a[1],10)||536===parseInt(a[1],10)&&11>=parseInt(a[2],10))}return S}Q.prototype.start=function(){this.f.serif=this.j.a.offsetWidth;this.f["sans-serif"]=this.m.a.offsetWidth;this.A=q();U(this)};
function la(a,b,c){for(var d in R)if(R.hasOwnProperty(d)&&b===a.f[R[d]]&&c===a.f[R[d]])return!0;return!1}function U(a){var b=a.g.a.offsetWidth,c=a.h.a.offsetWidth,d;(d=b===a.f.serif&&c===a.f["sans-serif"])||(d=T()&&la(a,b,c));d?q()-a.A>=a.w?T()&&la(a,b,c)&&(null===a.u||a.u.hasOwnProperty(a.a.c))?V(a,a.v):V(a,a.B):ma(a):V(a,a.v)}function ma(a){setTimeout(p(function(){U(this)},a),50)}function V(a,b){setTimeout(p(function(){v(this.g.a);v(this.h.a);v(this.j.a);v(this.m.a);b(this.a)},a),0)};function W(a,b,c){this.c=a;this.a=b;this.f=0;this.m=this.j=!1;this.s=c}var X=null;W.prototype.g=function(a){var b=this.a;b.g&&w(b.f,[b.a.c("wf",a.c,J(a).toString(),"active")],[b.a.c("wf",a.c,J(a).toString(),"loading"),b.a.c("wf",a.c,J(a).toString(),"inactive")]);K(b,"fontactive",a);this.m=!0;na(this)};
W.prototype.h=function(a){var b=this.a;if(b.g){var c=y(b.f,b.a.c("wf",a.c,J(a).toString(),"active")),d=[],e=[b.a.c("wf",a.c,J(a).toString(),"loading")];c||d.push(b.a.c("wf",a.c,J(a).toString(),"inactive"));w(b.f,d,e)}K(b,"fontinactive",a);na(this)};function na(a){0==--a.f&&a.j&&(a.m?(a=a.a,a.g&&w(a.f,[a.a.c("wf","active")],[a.a.c("wf","loading"),a.a.c("wf","inactive")]),K(a,"active")):L(a.a))};function oa(a){this.j=a;this.a=new ja;this.h=0;this.f=this.g=!0}oa.prototype.load=function(a){this.c=new ca(this.j,a.context||this.j);this.g=!1!==a.events;this.f=!1!==a.classes;pa(this,new ha(this.c,a),a)};
function qa(a,b,c,d,e){var f=0==--a.h;(a.f||a.g)&&setTimeout(function(){var a=e||null,m=d||null||{};if(0===c.length&&f)L(b.a);else{b.f+=c.length;f&&(b.j=f);var h,l=[];for(h=0;h<c.length;h++){var k=c[h],n=m[k.c],r=b.a,x=k;r.g&&w(r.f,[r.a.c("wf",x.c,J(x).toString(),"loading")]);K(r,"fontloading",x);r=null;if(null===X)if(window.FontFace){var x=/Gecko.*Firefox\/(\d+)/.exec(window.navigator.userAgent),xa=/OS X.*Version\/10\..*Safari/.exec(window.navigator.userAgent)&&/Apple/.exec(window.navigator.vendor);
X=x?42<parseInt(x[1],10):xa?!1:!0}else X=!1;X?r=new P(p(b.g,b),p(b.h,b),b.c,k,b.s,n):r=new Q(p(b.g,b),p(b.h,b),b.c,k,b.s,a,n);l.push(r)}for(h=0;h<l.length;h++)l[h].start()}},0)}function pa(a,b,c){var d=[],e=c.timeout;ia(b);var d=ka(a.a,c,a.c),f=new W(a.c,b,e);a.h=d.length;b=0;for(c=d.length;b<c;b++)d[b].load(function(b,d,c){qa(a,f,b,d,c)})};function ra(a,b){this.c=a;this.a=b}
ra.prototype.load=function(a){function b(){if(f["__mti_fntLst"+d]){var c=f["__mti_fntLst"+d](),e=[],h;if(c)for(var l=0;l<c.length;l++){var k=c[l].fontfamily;void 0!=c[l].fontStyle&&void 0!=c[l].fontWeight?(h=c[l].fontStyle+c[l].fontWeight,e.push(new G(k,h))):e.push(new G(k))}a(e)}else setTimeout(function(){b()},50)}var c=this,d=c.a.projectId,e=c.a.version;if(d){var f=c.c.o;A(this.c,(c.a.api||"https://fast.fonts.net/jsapi")+"/"+d+".js"+(e?"?v="+e:""),function(e){e?a([]):(f["__MonotypeConfiguration__"+
d]=function(){return c.a},b())}).id="__MonotypeAPIScript__"+d}else a([])};function sa(a,b){this.c=a;this.a=b}sa.prototype.load=function(a){var b,c,d=this.a.urls||[],e=this.a.families||[],f=this.a.testStrings||{},g=new B;b=0;for(c=d.length;b<c;b++)z(this.c,d[b],C(g));var m=[];b=0;for(c=e.length;b<c;b++)if(d=e[b].split(":"),d[1])for(var h=d[1].split(","),l=0;l<h.length;l+=1)m.push(new G(d[0],h[l]));else m.push(new G(d[0]));E(g,function(){a(m,f)})};function ta(a,b){a?this.c=a:this.c=ua;this.a=[];this.f=[];this.g=b||""}var ua="https://fonts.googleapis.com/css";function va(a,b){for(var c=b.length,d=0;d<c;d++){var e=b[d].split(":");3==e.length&&a.f.push(e.pop());var f="";2==e.length&&""!=e[1]&&(f=":");a.a.push(e.join(f))}}
function wa(a){if(0==a.a.length)throw Error("No fonts to load!");if(-1!=a.c.indexOf("kit="))return a.c;for(var b=a.a.length,c=[],d=0;d<b;d++)c.push(a.a[d].replace(/ /g,"+"));b=a.c+"?family="+c.join("%7C");0<a.f.length&&(b+="&subset="+a.f.join(","));0<a.g.length&&(b+="&text="+encodeURIComponent(a.g));return b};function ya(a){this.f=a;this.a=[];this.c={}}
var za={latin:"BESbswy","latin-ext":"\u00e7\u00f6\u00fc\u011f\u015f",cyrillic:"\u0439\u044f\u0416",greek:"\u03b1\u03b2\u03a3",khmer:"\u1780\u1781\u1782",Hanuman:"\u1780\u1781\u1782"},Aa={thin:"1",extralight:"2","extra-light":"2",ultralight:"2","ultra-light":"2",light:"3",regular:"4",book:"4",medium:"5","semi-bold":"6",semibold:"6","demi-bold":"6",demibold:"6",bold:"7","extra-bold":"8",extrabold:"8","ultra-bold":"8",ultrabold:"8",black:"9",heavy:"9",l:"3",r:"4",b:"7"},Ba={i:"i",italic:"i",n:"n",normal:"n"},
Ca=/^(thin|(?:(?:extra|ultra)-?)?light|regular|book|medium|(?:(?:semi|demi|extra|ultra)-?)?bold|black|heavy|l|r|b|[1-9]00)?(n|i|normal|italic)?$/;
function Da(a){for(var b=a.f.length,c=0;c<b;c++){var d=a.f[c].split(":"),e=d[0].replace(/\+/g," "),f=["n4"];if(2<=d.length){var g;var m=d[1];g=[];if(m)for(var m=m.split(","),h=m.length,l=0;l<h;l++){var k;k=m[l];if(k.match(/^[\w-]+$/)){var n=Ca.exec(k.toLowerCase());if(null==n)k="";else{k=n[2];k=null==k||""==k?"n":Ba[k];n=n[1];if(null==n||""==n)n="4";else var r=Aa[n],n=r?r:isNaN(n)?"4":n.substr(0,1);k=[k,n].join("")}}else k="";k&&g.push(k)}0<g.length&&(f=g);3==d.length&&(d=d[2],g=[],d=d?d.split(","):
g,0<d.length&&(d=za[d[0]])&&(a.c[e]=d))}a.c[e]||(d=za[e])&&(a.c[e]=d);for(d=0;d<f.length;d+=1)a.a.push(new G(e,f[d]))}};function Ea(a,b){this.c=a;this.a=b}var Fa={Arimo:!0,Cousine:!0,Tinos:!0};Ea.prototype.load=function(a){var b=new B,c=this.c,d=new ta(this.a.api,this.a.text),e=this.a.families;va(d,e);var f=new ya(e);Da(f);z(c,wa(d),C(b));E(b,function(){a(f.a,f.c,Fa)})};function Ga(a,b){this.c=a;this.a=b}Ga.prototype.load=function(a){var b=this.a.id,c=this.c.o;b?A(this.c,(this.a.api||"https://use.typekit.net")+"/"+b+".js",function(b){if(b)a([]);else if(c.Typekit&&c.Typekit.config&&c.Typekit.config.fn){b=c.Typekit.config.fn;for(var e=[],f=0;f<b.length;f+=2)for(var g=b[f],m=b[f+1],h=0;h<m.length;h++)e.push(new G(g,m[h]));try{c.Typekit.load({events:!1,classes:!1,async:!0})}catch(l){}a(e)}},2E3):a([])};function Ha(a,b){this.c=a;this.f=b;this.a=[]}Ha.prototype.load=function(a){var b=this.f.id,c=this.c.o,d=this;b?(c.__webfontfontdeckmodule__||(c.__webfontfontdeckmodule__={}),c.__webfontfontdeckmodule__[b]=function(b,c){for(var g=0,m=c.fonts.length;g<m;++g){var h=c.fonts[g];d.a.push(new G(h.name,ga("font-weight:"+h.weight+";font-style:"+h.style)))}a(d.a)},A(this.c,(this.f.api||"https://f.fontdeck.com/s/css/js/")+ea(this.c)+"/"+b+".js",function(b){b&&a([])})):a([])};var Y=new oa(window);Y.a.c.custom=function(a,b){return new sa(b,a)};Y.a.c.fontdeck=function(a,b){return new Ha(b,a)};Y.a.c.monotype=function(a,b){return new ra(b,a)};Y.a.c.typekit=function(a,b){return new Ga(b,a)};Y.a.c.google=function(a,b){return new Ea(b,a)};var Z={load:p(Y.load,Y)};"function"===typeof define&&define.amd?define(function(){return Z}):"undefined"!==typeof module&&module.exports?module.exports=Z:(window.WebFont=Z,window.WebFontConfig&&Y.load(window.WebFontConfig));}());

},{}],"node_modules/game-asset-loader/utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createBase64Image = void 0;

// create image from data uri
const createBase64Image = dataUri => {
  return [dataUri].map(uri => {
    let image = new Image();
    image.src = uri;
    return image;
  }).reduce(img => img);
};

exports.createBase64Image = createBase64Image;
},{}],"node_modules/game-asset-loader/placeholders.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultImage = exports.blankImage = void 0;

/**
 * game/helpers/placeholders.js
 * 
 * What it Does:
 *   This file contains data uris for use as fallbacks
 * 
 *   blankImage: used as an invisible image for optional images, avoids safari restrictions
 *   
 *   defaultImage: placeholder image for unloaded images
 * 
 * What to Change:
 *   
 * How to Use it:
 */
// 1x1 px transparent png from http://png-pixel.com/
// blank image used for optional images
// fixes Safari restriction on drawing unloaded images to canvas
// https://github.com/konvajs/react-konva/issues/185
const blankImage = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=`; // 32x32 placeholder image from
// lets developer know image was not loaded

exports.blankImage = blankImage;
const defaultImage = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAABGdBTUEAALGPC/xhBQAAAAFzUkdC
AK7OHOkAAAA8UExURQAAANHR0UJCQmtra5ubm////xISEre3txMTE5ycnLi4uOnp6SYmJt3d3VhY
WPT09I2Njaqqqn19fcXFxbjmkisAAAFqSURBVFjDpdfbcoQgDAbggE1dDuK6ff93LajbLgpJgMw4
cPUNJL8XwDxYMM9f39BdCTAjQgIeI0ICYETYgRHhAAaEE+gX3oBQMGpDNHFFXKYckAkGVfz8Eyew
q84BkWBWgIB62eLemQsgEYwC0KjXZ9wrewUEwglUTiAQTqDcA4lwAsUp0IIyXA4aOkkDrcIdKAvx
CmgcKr2g0+BVzKObKkBRSIALAdfJrxtYp/2CVaAkJCCmx8Xw/FiPLwBPALvwuAHTER5r0yABKOAu
ZAB/gruQAbEHARQNXIUc2KfAAIU+5BUw0AAlpGEoBwxACGGJP5NmAfYWLCARaEAgMAAvcAArsAAn
8AAjCABakACkIAIoQQYQghCoC1KgKoiBmiAHKkIDUBZagKLQBJSENqAgNAJ3oRW4Cc3AVWgHLkIH
kAs9QCZ0AZ9CH/AhdAL/Qi/wJ3QDb6EfOIUB4BBGgCSYISAJY8AuwOjz/xdsEharPg6y9AAAAABJ
RU5ErkJggg==`;
exports.defaultImage = defaultImage;
},{}],"node_modules/game-asset-loader/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadFont = exports.loadSound = exports.loadImage = exports.loadList = void 0;

var _audioContext = _interopRequireDefault(require("audio-context"));

var _audioLoader = _interopRequireDefault(require("audio-loader"));

var _webfontloader = _interopRequireDefault(require("webfontloader"));

var _utils = require("./utils.js");

var _placeholders = require("./placeholders.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * What it Does:
 *   This file contains loaders for images, sounds, and fonts.
 *   and a loadList function that lets you load any of these in a list.
 * 
 *   loadList: takes a list of assets loaders (loadImage, loadSound, or loadFont)
 *   and returns a list of object containing { type, key, value }
 *   where value is the loaded asset only after all the assets have loaded
 *   
 *   loadImage: takes a key and a url and returns an object containing
 *   { type: 'image', key: '<key>', value: '<the loaded image>' }
 * 
 *   loadSound: takes a key and a url and returns an object containing
 *   { type: 'sound', key: '<key>', value: '<the loaded sound>' }
 * 
 *   loadFont: takes a key and a google fontName and returns an object containing
 *   { type: 'font', key: '<key>', value: '<the loaded font>' }
 *   
 * What to Change:
 *   
 *   
 * How to Use it:
 * 
 *   loadList: input an array of loaders and pass a function to handle the the loaded assets
 *   eg. loadList(<list of loaders>).then(<function handle loaded assets>)
 * 
 *     loadList([
 *       loadImage('image_key', 'image_url'),
 *       loadSound('sound_key', 'sound_url'),
 *       loadFont('font_key', 'font_name')
 *     ]).then((loadedAssets) => {
 *       // attach loaded assets
 *     })
 *   
 *   loadImage: 
 *       loadImage('image_key', 'image_url')
 *         .then((loadedImage) => {
 *            // attach loaded image
 *         }) 
 * 
 *   loadSound: 
 *       loadSound('sound_key', 'sound_url')
 *         .then((loadedSound) => {
 *            // attach loaded sound
 *         }) 
 * 
 *   loadFont: 
 *       loadFont('font_key', 'font_name')
 *         .then((loadedFont) => {
 *            // attach loaded font
 *         }) 
 *   
 */
const loadList = (list, progress) => {
  // calculate loading progress
  let i = 0;
  progress({
    percent: 0,
    loaded: null
  });

  for (const prm of list) {
    prm.then(asset => {
      i++;
      progress({
        percent: Math.floor(i * 100 / list.length),
        loaded: {
          type: asset.type,
          key: asset.key
        }
      });
    });
  }

  return Promise.all(list).then(assets => {
    return assets.reduce((collection, asset) => {
      // separate assets by type
      // add them to the collection
      const {
        type,
        key,
        value
      } = asset;
      const collectionIncludes = Object.keys(collection).includes(type);

      if (!collectionIncludes) {
        collection[type] = {};
      }

      collection[type][key] = value;
      return collection;
    }, {});
  });
};

exports.loadList = loadList;

const loadImage = (key, url, opts = {}) => {
  return new Promise((resolve, reject) => {
    let {
      optional,
      params
    } = opts; // reject with error for missing key or url

    if (!key) {
      reject(new Error('key required'));
    }

    let image = new Image();
    image.src = [url, params].filter(i => i).join('?'); // loaded

    image.onload = () => {
      // pre-decode so decoding will not block main thread
      // especially for large background images
      if (image.decode) {
        image.decode().then(() => {
          resolve({
            type: 'image',
            key: key,
            value: image
          });
        }).catch(err => {
          // decode error
          console.error(err);
          resolve({
            type: 'image',
            key: key,
            value: optional && url === '' ? (0, _utils.createBase64Image)(_placeholders.blankImage) : (0, _utils.createBase64Image)(_placeholders.defaultImage)
          });
        });
      } else {
        resolve({
          type: 'image',
          key: key,
          value: image
        });
      }
    }; // load error


    image.onerror = err => {
      if (!optional) {
        console.error(err);
      }

      resolve({
        type: 'image',
        key: key,
        value: optional && url === '' ? (0, _utils.createBase64Image)(_placeholders.blankImage) : (0, _utils.createBase64Image)(_placeholders.defaultImage)
      });
    };
  });
};

exports.loadImage = loadImage;

const loadSound = (key, url) => {
  let result = {
    type: 'sound',
    key: key,
    value: null
  };
  return new Promise((resolve, reject) => {
    // reject with error for missing key or url
    if (!key) {
      reject(new Error('key required'));
    }

    (0, _audioLoader.default)(url).then(sound => {
      resolve({
        type: 'sound',
        key: key,
        value: sound
      });
    }).catch(err => {
      // log an error and resolve a silent audio buffer
      // previously created with new AudioBuffer (unsupported on safari)
      // note: sampleRate must also be 22050 to work on safari
      // value: new AudioBuffer({ length: 1, numberOfChannels: 1, sampleRate: 8000 })
      console.error('loadSound', err);
      const audioCtx = (0, _audioContext.default)();
      resolve({
        type: 'sound',
        key: key,
        value: audioCtx.createBuffer(1, 1, 22050)
      });
    });
  });
};

exports.loadSound = loadSound;

const loadFont = (key, fontName, opts = {}) => {
  return new Promise((resolve, reject) => {
    let {
      fallback
    } = opts; // reject with error for missing key or url

    if (!key) {
      reject(new Error('key required'));
    }

    if (!fontName) {
      resolve({
        type: 'font',
        key: key,
        value: fallback || 'Arial'
      });
    }

    _webfontloader.default.load({
      google: {
        families: [fontName]
      },
      fontactive: familyName => {
        resolve({
          type: 'font',
          key: key,
          value: familyName
        });
      },
      fontinactive: () => {
        resolve({
          type: 'font',
          key: key,
          value: fallback || 'Arial'
        });
      }
    });
  });
};

exports.loadFont = loadFont;
},{"audio-context":"node_modules/audio-context/index.js","audio-loader":"node_modules/audio-loader/lib/browser.js","webfontloader":"node_modules/webfontloader/webfontloader.js","./utils.js":"node_modules/game-asset-loader/utils.js","./placeholders.js":"node_modules/game-asset-loader/placeholders.js"}],"node_modules/is-audio-buffer/index.js":[function(require,module,exports) {
/**
 * @module  is-audio-buffer
 */
'use strict';

module.exports = function isAudioBuffer (buffer) {
	//the guess is duck-typing
	return buffer != null
	&& typeof buffer.length === 'number'
	&& typeof buffer.sampleRate === 'number' //swims like AudioBuffer
	&& typeof buffer.getChannelData === 'function' //quacks like AudioBuffer
	// && buffer.copyToChannel
	// && buffer.copyFromChannel
	&& typeof buffer.duration === 'number'
};

},{}],"node_modules/audio-play/browser.js":[function(require,module,exports) {
/** @module  audio-play Play buffer in browser via WAA */

'use strict'

var getContext = require('audio-context')
var isAudioBuffer = require('is-audio-buffer')

module.exports = function Play (buffer, how, cb) {
	if (!isAudioBuffer(buffer)) throw Error('Argument should be an audio buffer')

	if (how instanceof Function) {
		cb = how
	}

	how = how || {}
	cb = cb || function () {}

	if (how.context == null) how.context = getContext()

	if (how.currentTime == null) how.currentTime = 0
	if (how.start == null) how.start = 0
	if (how.end == null) how.end = buffer.duration
	how.start = normTime(how.start, buffer.duration)
	how.end = normTime(how.end, buffer.duration)

	var sourceNode = createNode(buffer, how)

	if (!how.gain) {
		how.gain = how.context.createGain()
		how.gain.gain.value = how.volume == null ? 1 : how.volume
		how.gain.connect(how.context.destination)
	}
	sourceNode.connect(how.gain)

	sourceNode.addEventListener('ended', cb)

	//provide API
	play.play = pause.play = play
	play.pause = pause.pause = pause

	var startTime = 0
	var isPlaying = false

	return how.autoplay != false ? play() : play

	function play () {
		if (isPlaying) return pause

		isPlaying = true

		startTime = how.context.currentTime

		if (how.loop) {
			sourceNode.start(startTime, how.start + how.currentTime)
		}
		else {
			sourceNode.start(startTime, how.start + how.currentTime, how.end - how.start)
		}

		return pause
	}

	function pause () {
		if (!isPlaying) return pause.play
		isPlaying = false

		sourceNode.stop()
		sourceNode.removeEventListener('ended', cb)

		var playedTime = (how.context.currentTime - startTime)

		how.autoplay = false
		how.currentTime = playedTime

		var playback = Play(buffer, how, cb)
		play.play = pause.play = playback.play
		play.pause = pause.pause = playback.pause
		play.currentTime = pause.currentTime = playback.currentTime = how.currentTime

		return playback
	}
}

function normTime (time, duration) {
	return time < 0 ? (duration + (time % duration)) : Math.min(duration, time)
}

function createNode (buffer, how) {
	var sourceNode = how.context.createBufferSource()

	sourceNode.buffer = buffer

	//init options
	if (how.detune != null) sourceNode.detune = how.detune
	if (how.rate != null) sourceNode.playbackRate.value = how.rate


	if (how.loop) {
		sourceNode.loop = true
		sourceNode.loopStart = how.start
		sourceNode.loopEnd = how.end
	}

	return sourceNode
}

},{"audio-context":"node_modules/audio-context/index.js","is-audio-buffer":"node_modules/is-audio-buffer/index.js"}],"node_modules/unlock-audio-context/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

// read userAgent
const device = () => {
  return {
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent),
    iOS: /iPhone|iPad|iPod/i.test(navigator.userAgent)
  };
}; // unlock locked audio contexts


const unlockAudio = audioCtx => {
  let currentDevice = device();
  let called = false;

  if (currentDevice.isMobile && audioCtx.state === 'suspended') {
    // check for locked audio context on touchend
    // NOTE: NOT using touchstart to avoid getting relocked incase gesture is detected.
    document.addEventListener('touchend', () => {
      if (!called && audioCtx.state !== 'running') {
        audioCtx.resume();
        called = true;
      }
    });
  }
};

var _default = unlockAudio;
exports.default = _default;
},{}],"node_modules/prevent-parent/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

// prevent parent
const preventParent = (preventedKeysList = ['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft']) => {
  document.addEventListener('keydown', e => {
    if (preventedKeysList.includes(e.code)) {
      e.preventDefault();
      e.stopPropagation();
    }
  });
};

var _default = preventParent;
exports.default = _default;
},{}],"game/helpers/utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hashCode = exports.boundBy = exports.throttled = void 0;

/**
 * game/helpers/utils.js
 * 
 * What it Does:
 *   This file contains utilities for the game
 * 
 *   throttled: wraps a function so that it can't be called until the delay
 *   in milliseconds has gone by. useful for stopping unwanted side effects of button mashing.
 *   https://gph.is/1syA0yc
 * 
 * 
 * What to Change:
 *   Add any new methods that don't fit anywhere else
 *   eg. 
 * 
 */
// throttled function wrapper
// checkout: https://outline.com/nBajAS
var throttled = function throttled(delay, fn) {
  var lastCall = 0;
  return function () {
    var now = new Date().getTime();

    if (now - lastCall < delay) {
      return;
    }

    lastCall = now;
    return fn.apply(void 0, arguments);
  };
}; // boundBy
// apply a lower and upper bound to a number


exports.throttled = throttled;

var boundBy = function boundBy(n, upper, lower) {
  return [n].map(function (n) {
    return n < lower ? lower : n;
  }).map(function (n) {
    return n > upper ? upper : n;
  }).reduce(function (n) {
    return n;
  });
}; // toy hash for prefixes
// useful for prefexing localstorage keys


exports.boundBy = boundBy;

var hashCode = function hashCode(str) {
  var base = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 16;
  return [str.split("").reduce(function (a, b) {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0)] // create simple hash from string
  .map(function (num) {
    return Math.abs(num);
  }) // only positive numbers
  .map(function (num) {
    return num.toString(base);
  }) // convert to base
  .reduce(function (h) {
    return h;
  }); // fold
};

exports.hashCode = hashCode;
},{}],"game/objects/image.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * game/objects/image.js
 * 
 * What it Does:
 *   This file is a basic image class
 *   it contains a basic draw method that draws the image to screen
 * 
 */
var Image =
/*#__PURE__*/
function () {
  function Image(_ref) {
    var ctx = _ref.ctx,
        image = _ref.image,
        x = _ref.x,
        y = _ref.y,
        width = _ref.width,
        height = _ref.height;

    _classCallCheck(this, Image);

    this.ctx = ctx;
    this.image = image;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  _createClass(Image, [{
    key: "draw",
    value: function draw(x, y) {
      var xPosition = x || this.x;
      var yPosition = y || this.y;
      this.ctx.drawImage(this.image, xPosition, yPosition, this.width, this.height);
    }
  }]);

  return Image;
}();

var _default = Image;
exports.default = _default;
},{}],"game/objects/sprite.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * game/objects/sprite.js
 * 
 * What it Does:
 *   This file is a basic sprite
 *   it implements abilities like move(x, y)
 *   speed, direction, velocity, and bounds
 * 
 * What to Change:
 *   Add any new methods you want all your
 *   game characters that are also sprites to have.
 *   eg. 
 * 
 */
var Sprite =
/*#__PURE__*/
function () {
  function Sprite(_ref) {
    var x = _ref.x,
        y = _ref.y,
        width = _ref.width,
        height = _ref.height,
        speed = _ref.speed,
        direction = _ref.direction,
        bounds = _ref.bounds;

    _classCallCheck(this, Sprite);

    // x and y
    this.x = x;
    this.y = y; // previous x and y

    this.px = x;
    this.py = x; // center x and y

    this.cx = x + width / 2;
    this.cy = y + height / 2; // velocity x and y

    this.vx = 0;
    this.vy = 0; // width and height

    this.width = width;
    this.height = height; // radius

    this.radius = (width + height) / 4; // speed

    this.speed = speed || 1; // direction

    this.direction = direction || 'right'; // bounds

    this.bounds = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    };
    this.setBounds(bounds);
  }

  _createClass(Sprite, [{
    key: "move",
    value: function move(x, y, m) {
      var dx = x === 0 ? this.x : this.x + x * this.speed * m;
      var dy = y === 0 ? this.y : this.y + y * this.speed * m; // apply x bounds

      var inBoundsX = dx >= this.bounds.left && dx <= this.bounds.right - this.width;

      if (inBoundsX) {
        this.setX(dx);
      } else {
        var snapTo = dx < this.bounds.left ? this.bounds.left : this.bounds.right - this.width;
        this.setX(snapTo);
      } // apply y bounds


      var inBoundsY = dy >= this.bounds.top && dy <= this.bounds.bottom - this.height;

      if (inBoundsY) {
        this.setY(dy);
      } else {
        var _snapTo = dy < this.bounds.top ? this.bounds.top : this.bounds.bottom - this.height;

        this.setY(_snapTo);
      } // set direction


      if (x < 0) {
        this.direction = 'right';
      }

      if (x > 0) {
        this.direction = 'left';
      }
    }
  }, {
    key: "setX",
    value: function setX(x) {
      this.px = this.x; // store previous x value

      this.x = x; // set x

      this.cx = this.x + this.width / 2; // set center x

      this.vx = this.x - this.px; // set velocity x
    }
  }, {
    key: "setY",
    value: function setY(y) {
      this.py = this.y; // store previous y value

      this.y = y; // set y

      this.cy = this.y + this.height / 2; // set center y

      this.vy = this.y - this.py; // set velocity y
    }
  }, {
    key: "setBounds",
    value: function setBounds(_ref2) {
      var top = _ref2.top,
          right = _ref2.right,
          bottom = _ref2.bottom,
          left = _ref2.left;
      var bounds = {
        top: top,
        right: right,
        bottom: bottom,
        left: left
      };
      this.bounds = _objectSpread({}, this.bounds, {}, bounds);
    }
  }]);

  return Sprite;
}();

var _default = Sprite;
exports.default = _default;
},{}],"game/objects/imageSprite.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sprite = _interopRequireDefault(require("./sprite.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ImageSprite =
/*#__PURE__*/
function (_Sprite) {
  _inherits(ImageSprite, _Sprite);

  function ImageSprite(options) {
    var _this;

    _classCallCheck(this, ImageSprite);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ImageSprite).call(this, options));
    _this.ctx = options.ctx;
    _this.image = options.image;
    return _this;
  }

  _createClass(ImageSprite, [{
    key: "draw",
    value: function draw() {
      // save canvas context
      this.ctx.save(); // code for flipping image to match direction

      var scaleX = this.direction === 'left' ? -1 : 1;
      var xPosition = this.direction === 'left' ? -1 * this.x : this.x;
      var trX = this.direction === 'left' ? this.width : 0;
      this.ctx.translate(trX, 0);
      this.ctx.scale(scaleX, 1); // draw the image to canvas

      this.ctx.drawImage(this.image, xPosition, this.y, this.width, this.height); // restore canvas context

      this.ctx.restore();
    }
  }]);

  return ImageSprite;
}(_sprite.default);

var _default = ImageSprite;
exports.default = _default;
},{"./sprite.js":"game/objects/sprite.js"}],"game/characters/player.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _imageSprite = _interopRequireDefault(require("../objects/imageSprite.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Player =
/*#__PURE__*/
function (_ImageSprite) {
  _inherits(Player, _ImageSprite);

  function Player(options) {
    var _this;

    _classCallCheck(this, Player);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Player).call(this, options));
    _this.ctx = options.ctx;
    _this.color = options.color;
    _this.name = options.name;
    _this.score = 0;
    return _this;
  }

  _createClass(Player, [{
    key: "draw",
    value: function draw() {
      // this.ctx.fillStyle = this.color;
      // this.ctx.fillRect(this.x, this.y, this.width, this.height);
      this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  }]);

  return Player;
}(_imageSprite.default);

var _default = Player;
exports.default = _default;
},{"../objects/imageSprite.js":"game/objects/imageSprite.js"}],"game/characters/ball.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _imageSprite = _interopRequireDefault(require("../objects/imageSprite.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Ball =
/*#__PURE__*/
function (_ImageSprite) {
  _inherits(Ball, _ImageSprite);

  function Ball(options) {
    var _this;

    _classCallCheck(this, Ball);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Ball).call(this, options));
    _this.dx = -1; // this.dy = -1;

    _this.dy = 0;
    _this.launched = false;
    return _this;
  }

  _createClass(Ball, [{
    key: "move",
    value: function move(m) {
      if (!this.launched) {
        return;
      }

      _get(_getPrototypeOf(Ball.prototype), "move", this).call(this, this.dx, this.dy, m);
    }
  }, {
    key: "launch",
    value: function launch(delay, dx, offset) {
      var _this2 = this;

      var totalOffset = (offset + this.width) * dx;
      this.stop();

      if (delay) {
        setTimeout(function () {
          _this2.launched = true;
          _this2.x = _this2.x + totalOffset;
          _this2.dx = dx;
        }, delay);
      } else {
        this.launched = true;
        this.x = this.x + totalOffset;
        this.dx = dx;
      }
    }
  }, {
    key: "stop",
    value: function stop() {
      this.launched = false;
      this.dx = 0;
    }
  }, {
    key: "collisionsWith",
    value: function collisionsWith(entities) {
      var _this3 = this;

      var result = entities.find(function (ent) {
        return _this3.collidesWith(ent);
      });
      return result;
    }
  }, {
    key: "collidesWith",
    value: function collidesWith(entity) {
      var distanceX = Math.abs(entity.cx - this.cx);
      var onY = this.cy > entity.y && this.cy < entity.y + entity.height;
      return onY && distanceX < (entity.width + this.width) / 2;
    }
  }]);

  return Ball;
}(_imageSprite.default);

var _default = Ball;
exports.default = _default;
},{"../objects/imageSprite.js":"game/objects/imageSprite.js"}],"game/main.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _kojiTools = _interopRequireDefault(require("koji-tools"));

var _animationframe = require("./helpers/animationframe.js");

var _gameAssetLoader = require("game-asset-loader");

var _audioContext = _interopRequireDefault(require("audio-context"));

var _audioPlay = _interopRequireDefault(require("audio-play"));

var _unlockAudioContext = _interopRequireDefault(require("unlock-audio-context"));

var _preventParent = _interopRequireDefault(require("prevent-parent"));

var _utils = require("./helpers/utils.js");

var _image = _interopRequireDefault(require("./objects/image.js"));

var _player = _interopRequireDefault(require("./characters/player.js"));

var _ball = _interopRequireDefault(require("./characters/ball.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Game =
/*#__PURE__*/
function () {
  function Game(canvas, overlay, topbar, config) {
    var _this = this;

    _classCallCheck(this, Game);

    this.config = config; // customization

    this.topbar = topbar;
    this.overlay = overlay;
    this.prefix = (0, _utils.hashCode)(this.config.settings.name); // set prefix for local-storage keys

    this.canvas = canvas; // game screen

    this.ctx = canvas.getContext("2d"); // game screen context

    this.audioCtx = (0, _audioContext.default)(); // create new audio context

    (0, _unlockAudioContext.default)(this.audioCtx);
    this.playlist = []; // prevent parent wondow form scrolling

    (0, _preventParent.default)(); // frame count, rate, and time
    // this is just a place to keep track of frame rate (not set it)

    this.frame = {
      count: 0,
      time: Date.now(),
      rate: null,
      scale: null
    }; // game settings

    this.state = {
      current: 'loading',
      prev: null,
      paused: false,
      muted: localStorage.getItem(this.prefix.concat('muted')) === 'true'
    };
    this.input = {
      active: true,
      current: 'keyboard',
      keyboard: {
        up: false,
        right: false,
        left: false,
        down: false
      },
      mouse: {
        x: 0,
        y: 0,
        click: false
      },
      touch: {
        x: 0,
        y: 0
      }
    };
    this.input2 = {
      active: false,
      current: 'keyboard',
      keyboard: {
        up: false,
        right: false,
        left: false,
        down: false
      }
    };
    this.images = {}; // place to keep images

    this.sounds = {}; // place to keep sounds

    this.fonts = {}; // place to keep fonts
    // setup event listeners
    // handle keyboard events

    document.addEventListener('keydown', function (_ref) {
      var code = _ref.code;
      return _this.handleKeyboardInput('keydown', code);
    });
    document.addEventListener('keyup', function (_ref2) {
      var code = _ref2.code;
      return _this.handleKeyboardInput('keyup', code);
    }); // setup event listeners for mouse movement

    document.addEventListener('mousemove', function (_ref3) {
      var clientY = _ref3.clientY;
      return _this.handleMouseMove(clientY);
    }); // setup event listeners for mouse movement

    document.addEventListener('touchmove', function (_ref4) {
      var touches = _ref4.touches;
      return _this.handleTouchMove(touches[0]);
    }); // handle overlay clicks

    this.overlay.root.addEventListener('click', function (_ref5) {
      var target = _ref5.target;
      return _this.handleClicks(target);
    }); // handle resize events

    window.addEventListener('resize', function () {
      return _this.handleResize();
    });
    window.addEventListener("orientationchange", function (e) {
      return _this.handleResize(e);
    }); // handle koji config changes

    _kojiTools.default.on('change', function (scope, key, value) {
      console.log('updating configs...', scope, key, value);
      _this.config[scope][key] = value;

      _this.cancelFrame(_this.frame.count - 1);

      _this.load();
    });
  }

  _createClass(Game, [{
    key: "load",
    value: function load() {
      var _this2 = this;

      // load pictures, sounds, and fonts
      // set topbar and topbar color
      this.topbar.active = this.config.settings.gameTopBar;
      this.topbar.style.display = this.topbar.active ? 'block' : 'none';
      this.topbar.style.backgroundColor = this.config.colors.primaryColor;
      this.canvas.width = window.innerWidth; // set game screen width

      this.canvas.height = this.topbar.active ? window.innerHeight - this.topbar.clientHeight : window.innerHeight; // set game screen height

      this.screen = {
        top: 0,
        bottom: this.canvas.height,
        left: 0,
        right: this.canvas.width,
        centerX: this.canvas.width / 2,
        centerY: this.canvas.height / 2,
        scale: (this.canvas.width + this.canvas.height) / 2 * 0.003
      }; // set loading indicator to textColor

      document.querySelector('#loading').style.color = this.config.colors.textColor; // set winscore

      this.setState({
        winScore: parseInt(this.config.settings.winScore)
      }); // set overlay styles

      this.overlay.setStyles(_objectSpread({}, this.config.colors, {}, this.config.settings)); // make a list of assets

      var gameAssets = [(0, _gameAssetLoader.loadImage)('backgroundImage', this.config.images.backgroundImage), (0, _gameAssetLoader.loadImage)('ballImage', this.config.images.ballImage), (0, _gameAssetLoader.loadImage)('player1Image', this.config.images.player1Image), (0, _gameAssetLoader.loadImage)('player2Image', this.config.images.player2Image), (0, _gameAssetLoader.loadSound)('bounceSound', this.config.sounds.bounceSound), (0, _gameAssetLoader.loadSound)('scoreSound', this.config.sounds.scoreSound), (0, _gameAssetLoader.loadSound)('backgroundMusic', this.config.sounds.backgroundMusic), (0, _gameAssetLoader.loadFont)('gameFont', this.config.settings.fontFamily)]; // put the loaded assets the respective containers

      (0, _gameAssetLoader.loadList)(gameAssets, function (progress) {
        document.getElementById('loading-progress').textContent = "".concat(progress.percent, "%");
      }).then(function (assets) {
        _this2.images = assets.image;
        _this2.sounds = assets.sound;
      }).then(function () {
        return _this2.create();
      }).catch(function (err) {
        return console.error(err);
      });
    }
  }, {
    key: "create",
    value: function create() {
      // create game characters
      var _this$screen = this.screen,
          scale = _this$screen.scale,
          centerY = _this$screen.centerY,
          right = _this$screen.right;
      var _this$config$settings = this.config.settings,
          playerHeight = _this$config$settings.playerHeight,
          playerWidth = _this$config$settings.playerWidth;
      var pHeight = playerHeight * scale;
      var pWidth = playerWidth * scale;
      this.player1 = new _player.default({
        name: 'player1',
        ctx: this.ctx,
        image: this.images.player1Image,
        // color: this.config.colors.rightPaddleColor,
        x: right - pWidth * 2,
        y: centerY - pHeight / 2,
        width: pWidth * 1.5,
        height: pHeight * 1.3,
        speed: 50,
        bounds: this.screen
      });
      this.player2 = new _player.default({
        name: 'player2',
        ctx: this.ctx,
        image: this.images.player2Image,
        // color: this.config.colors.leftPaddleColor,
        x: 0,
        y: centerY - pHeight / 2,
        width: pWidth * 5,
        height: pHeight,
        speed: 50,
        bounds: this.screen
      }); // ball

      var ballSpeed = parseInt(this.config.settings.ballSpeed);
      var ballSize = parseInt(this.config.settings.ballSize);
      var ballWidth = ballSize * scale;
      var ballHeight = ballSize * scale;
      this.ball = new _ball.default({
        ctx: this.ctx,
        image: this.images.ballImage,
        x: this.screen.right + ballWidth,
        y: this.player1.y,
        width: ballWidth,
        height: ballHeight,
        speed: ballSpeed,
        bounds: {
          top: 0,
          right: this.screen.right + ballWidth,
          left: this.screen.left - ballWidth,
          bottom: this.screen.bottom
        }
      }); // background

      this.background = new _image.default({
        ctx: this.ctx,
        image: this.images.backgroundImage,
        x: 0,
        y: 0,
        width: this.screen.right,
        height: this.screen.bottom
      }); // set game state ready

      this.setState({
        current: 'ready'
      });
      this.play();
    }
  }, {
    key: "play",
    value: function play() {
      var _this3 = this;

      // update game characters
      // clear the screen of the last picture
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height); // draw and do stuff that you need to do
      // no matter the game state

      if (this.background) {
        this.background.draw();
      } // update scores


      this.overlay.setScore1("".concat(this.player1.score, "/").concat(this.state.winScore));
      this.overlay.setScore2("".concat(this.player2.score, "/").concat(this.state.winScore)); // ready to play

      if (this.state.current === 'ready' && this.state.prev === 'loading') {
        this.overlay.hideLoading();
        this.canvas.style.opacity = 1;
        this.overlay.setBanner(this.config.settings.name);
        this.overlay.setButton(this.config.settings.startText);
        this.overlay.showStats();
        this.overlay.setMute(this.state.muted);
        this.overlay.setPause(this.state.paused);
        this.overlay.setInstructions({
          desktop: this.config.settings.instructionsDesktop,
          mobile: this.config.settings.instructionsMobile
        });
        this.setState({
          current: 'ready'
        });
      } // game play


      if (this.state.current === 'play') {
        // hide overlays if coming from ready
        if (this.state.prev === 'ready') {
          this.overlay.hideBanner();
          this.overlay.hideButton();
          this.overlay.hideInstructions();
        } // check for winner


        if (this.player1.score === this.state.winScore) {
          this.setState({
            current: 'win-player1'
          });
        }

        if (this.player2.score === this.state.winScore) {
          this.setState({
            current: 'win-player2'
          });
        }

        if (!this.state.muted && !this.state.backgroundMusic) {
          var sound = this.sounds.backgroundMusic;
          this.state.backgroundMusic = (0, _audioPlay.default)(sound, {
            start: 0,
            end: sound.duration,
            loop: true,
            context: this.audioCtx
          });
        } // player 1


        if (this.input.current === 'keyboard') {
          var dy1 = (this.input.keyboard.up ? -1 : 0) + (this.input.keyboard.down ? 1 : 0);
          this.player1.move(0, dy1, this.frame.scale);
        }

        if (this.input.current === 'mouse') {
          var y = this.input.mouse.y - this.canvas.offsetTop;
          var diffY = y - this.player1.y - this.player1.height / 2;
          this.player1.move(0, diffY / 100, 1);
        }

        if (this.input.current === 'touch') {
          var _y = this.input.touch.y - this.canvas.offsetTop;

          var _diffY = _y - this.player1.y - this.player1.height / 2;

          this.player1.move(0, _diffY / 100, 1);
        }

        this.player1.draw(); // player 2: computer

        if (!this.input2.active && this.ball.launched && this.ball.dx < 0) {
          // move computer player toward the ball
          // get diffY and calculate dy
          var _diffY2 = this.ball.y / 2 - this.player2.y;

          var dy2 = _diffY2 / (this.ball.x * 2); // apply a difficulty/speed limit

          var difficulty = parseInt(this.config.settings);
          var speedLimit = difficulty / 2;
          var dy2capped = (0, _utils.boundBy)(dy2, speedLimit, -speedLimit);
          this.player2.move(0, dy2capped, this.frame.scale);
        } // player 2: human


        if (this.input2.active) {
          // move player 2
          var _dy = (this.input2.keyboard.up ? -1 : 0) + (this.input2.keyboard.down ? 1 : 0);

          this.player2.move(0, _dy, this.frame.scale);
        }

        this.player2.draw(); // ball
        // bounce ball off of ceiling or floor

        var onEdgeY = this.ball.y === this.screen.top || this.ball.y === this.screen.bottom - this.ball.height;

        if (onEdgeY) {
          this.ball.dy = -this.ball.dy;
        } // bounce ball off player1


        var collided = this.ball.collisionsWith([this.player1, this.player2]);

        if (collided && collided.name === 'player1') {
          // add some velocity
          // change ball direction
          // add some speed
          this.ball.dx = -1;
          this.ball.speed += 1;
        } // bounce ball off player2


        if (collided && collided.name === 'player2') {
          this.ball.stop();
          this.ball.setY(-100);
          this.player2.score += 1;
          this.ball.launched = false;
          this.ball.x = this.canvas.width;
        } // if ball touches left side, player1 scores


        if (this.ball.launched && this.ball.x <= this.ball.bounds.left) {
          // give player1 one point
          this.player1.score += 1; // reset ball speed

          this.ball.speed = parseInt(this.config.settings.ballSpeed);
          this.ball.launched = false;
          this.ball.x = this.canvas.width;
        }

        this.ball.move(this.frame.scale);
        this.ball.draw();
      } // player wins


      if (this.state.current === 'win-player1') {
        this.overlay.setBanner(this.config.settings.player1WinText);
      }

      if (this.state.current === 'win-player2') {
        this.overlay.setBanner(this.config.settings.player2WinText);
      } // draw the next screen


      this.requestFrame(function () {
        return _this3.play();
      });
    }
  }, {
    key: "relaunchBall",
    value: function relaunchBall(side) {
      // ignore if ball is launched
      if (this.ball.launched) {
        return;
      } // reset ball speed


      this.ball.speed = parseInt(this.config.settings.ballSpeed); // launch from right

      if (side === 'right') {
        this.ball.setY(this.player1.y + this.player1.height / 4);
        this.ball.launch(null, -1, this.player1.width);
      } // launch from left


      if (side === 'left') {
        this.ball.setY(this.player2.y);
        this.ball.launch(null, 1, this.player2.width);
      }
    } // event listeners

  }, {
    key: "handleClicks",
    value: function handleClicks(target) {
      if (this.state.current === 'loading') {
        return;
      } // mute


      if (target.id === 'mute') {
        this.mute();
        return;
      } // pause


      if (target.id === 'pause') {
        this.pause();
        return;
      } // button


      if (target.id === 'button') {
        this.setState({
          current: 'play'
        });
        return;
      } // relaunch ball


      var onSide = this.ball.launched === false && this.ball.x > this.screen.centerX;

      if (this.state.current === 'play' && onSide) {
        this.relaunchBall('right');
      }

      if (this.state.current.includes('win')) {
        document.location.reload();
      }
    }
  }, {
    key: "handleKeyboardInput",
    value: function handleKeyboardInput(type, code) {
      this.input.current = 'keyboard'; // player 1

      if (type === 'keydown') {
        if (code === 'ArrowUp') {
          this.input.keyboard.up = true;
        }

        if (code === 'ArrowDown') {
          this.input.keyboard.down = true;
        }
      }

      if (type === 'keyup') {
        if (code === 'ArrowUp') {
          this.input.keyboard.up = false;
        }

        if (code === 'ArrowDown') {
          this.input.keyboard.down = false;
        } // relaunch player 1


        if (code === 'Space') {
          var rightSide = this.ball.launched === false && this.ball.x > this.screen.centerX;

          if (this.state.current === 'play' && rightSide) {
            this.relaunchBall('right');
          }
        }
      } // player 2


      if (type === 'keydown') {
        if (code === 'KeyW') {
          this.input2.keyboard.up = true;
        }

        if (code === 'KeyS') {
          this.input2.keyboard.down = true;
        } // relaunch player 2


        if (code === 'ShiftLeft') {
          var _rightSide = this.ball.launched === false && this.ball.x > this.screen.centerX;

          if (this.state.current === 'play' && !_rightSide) {
            this.relaunchBall('left');
          }
        }
      }

      if (type === 'keyup') {
        if (code === 'KeyW') {
          this.input2.keyboard.up = false;
        }

        if (code === 'KeyS') {
          this.input2.keyboard.down = false;
        }
      } // game state
      // switch to 2 player if W or S are pressed


      if (type === 'keydown' && ['KeyW', 'KeyS'].includes(code) && !this.input2.active) {
        this.input2.active = true;
      } // pause and play game if P is pressed


      if (type === 'keydown' && code === 'KeyP') {
        this.pause();
      } // reload game after win and Spacebar pressed


      if (type === 'keyup' && code === 'Space' && this.state.current.includes('win')) {
        document.location.reload();
      }
    }
  }, {
    key: "handleMouseMove",
    value: function handleMouseMove(y) {
      this.input.current = 'mouse';
      this.input.mouse.y = y;
    }
  }, {
    key: "handleTouchMove",
    value: function handleTouchMove(touch) {
      var clientY = touch.clientY;
      this.input.current = 'touch';
      this.input.touch.y = clientY;
    }
  }, {
    key: "handleResize",
    value: function handleResize() {
      document.location.reload();
    } // game helpers
    // method:pause pause game

  }, {
    key: "pause",
    value: function pause() {
      var _this4 = this;

      if (this.state.current != 'play') {
        return;
      }

      this.state.paused = !this.state.paused;
      this.overlay.setPause(this.state.paused);

      if (this.state.paused) {
        // pause game loop
        this.cancelFrame(this.frame.count - 1); // mute all game sounds

        this.audioCtx.suspend();
        this.overlay.setBanner('Paused');
      } else {
        // resume game loop
        this.requestFrame(function () {
          return _this4.play();
        }, true); // resume game sounds if game not muted

        if (!this.state.muted) {
          this.audioCtx.resume();
        }

        this.overlay.hide('banner');
      }
    } // method:mute mute game

  }, {
    key: "mute",
    value: function mute() {
      var key = this.prefix.concat('muted');
      localStorage.setItem(key, localStorage.getItem(key) === 'true' ? 'false' : 'true');
      this.state.muted = localStorage.getItem(key) === 'true';
      this.overlay.setMute(this.state.muted);

      if (this.state.muted) {
        // mute all game sounds
        this.audioCtx.suspend();
      } else {
        // unmute all game sounds
        if (!this.state.paused) {
          this.audioCtx.resume();
        }
      }
    }
  }, {
    key: "playback",
    value: function playback(key, audioBuffer) {
      var _this5 = this;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (this.state.muted) {
        return;
      }

      var id = Math.random().toString(16).slice(2);
      this.playlist.push({
        id: id,
        key: key,
        playback: (0, _audioPlay.default)(audioBuffer, _objectSpread({}, {
          start: 0,
          end: audioBuffer.duration,
          context: this.audioCtx
        }, {}, options), function () {
          // remove played sound from playlist
          _this5.playlist = _this5.playlist.filter(function (s) {
            return s.id != id;
          });
        })
      });
    }
  }, {
    key: "stopPlayback",
    value: function stopPlayback(key) {
      this.playlist = this.playlist.filter(function (s) {
        var targetBuffer = s.key === key;

        if (targetBuffer) {
          s.playback.pause();
        }

        return targetBuffer;
      });
    } // reset game

  }, {
    key: "reset",
    value: function reset() {
      document.location.reload();
    } // update game state

  }, {
    key: "setState",
    value: function setState(state) {
      this.state = _objectSpread({}, this.state, {}, {
        prev: this.state.current
      }, {}, state);
    } // request new frame
    // wraps requestAnimationFrame.
    // see game/helpers/animationframe.js for more information

  }, {
    key: "requestFrame",
    value: function requestFrame(next, resumed) {
      var now = Date.now();
      this.frame = {
        count: (0, _animationframe.requestAnimationFrame)(next),
        time: now,
        rate: resumed ? 0 : now - this.frame.time,
        scale: this.screen.scale * this.frame.rate * 0.01
      };
    } // cancel frame
    // wraps cancelAnimationFrame.
    // see game/helpers/animationframe.js for more information

  }, {
    key: "cancelFrame",
    value: function cancelFrame() {
      (0, _animationframe.cancelAnimationFrame)(this.frame.count);
    }
  }]);

  return Game;
}();

var _default = Game;
exports.default = _default;
},{"koji-tools":"node_modules/koji-tools/index.js","./helpers/animationframe.js":"game/helpers/animationframe.js","game-asset-loader":"node_modules/game-asset-loader/index.js","audio-context":"node_modules/audio-context/index.js","audio-play":"node_modules/audio-play/browser.js","unlock-audio-context":"node_modules/unlock-audio-context/index.js","prevent-parent":"node_modules/prevent-parent/index.js","./helpers/utils.js":"game/helpers/utils.js","./objects/image.js":"game/objects/image.js","./characters/player.js":"game/characters/player.js","./characters/ball.js":"game/characters/ball.js"}],"game/overlay.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * game/overlay.js
 * 
 * What it Does:
 *   This file provides methods for showing and setting text, buttons, etc on the an html overlay of the game screen.
 *   
 *   show(<node string>):
 *   show is a helper that takes string matching the node to show
 *   eg. show('button')
 * 
 *   hide(<node string>):
 *   hide is a helper that takes string matching the node to hide
 *   eg. hide('button')
 *   
 * What to Change:
 *   changes to the overlay are mage here, index.html, and style.css
 *   
 * How to Use it:
 *   write some html containing the 
 *   pass a dom node into the Overlay constructor
 *   eg. const overlay = new Overlay(<overlay node>);
 * 
 */
var Overlay =
/*#__PURE__*/
function () {
  function Overlay(node) {
    _classCallCheck(this, Overlay);

    this.root = node;
    this.container = node.querySelector('.container');
    this.loading = node.querySelector('#loading');
    this.banner = node.querySelector('#banner');
    this.button = node.querySelector('#button');
    this.instructions = node.querySelector('#instructions');
    this.score1 = node.querySelector('#score1');
    this.score2 = node.querySelector('#score2');
    this.mute = node.querySelector('#mute');
    this.pause = node.querySelector('#pause');
    this.styles = {};
  }

  _createClass(Overlay, [{
    key: "setLoading",
    value: function setLoading() {
      this.show('loading');
    }
  }, {
    key: "hideLoading",
    value: function hideLoading() {
      this.hide('loading');
    }
  }, {
    key: "setBanner",
    value: function setBanner(message) {
      this.banner.textContent = message;
      this.show('banner');
    }
  }, {
    key: "hideBanner",
    value: function hideBanner() {
      this.hide('banner');
    }
  }, {
    key: "setButton",
    value: function setButton(message) {
      this.button.style.fontFamily = this.styles.fontFamily; // fix for safari

      this.button.innerHTML = "<span id=\"buttonspan\">".concat(message, "</span>");
      this.show('button');
    }
  }, {
    key: "hideButton",
    value: function hideButton() {
      this.hide('button');
    }
  }, {
    key: "setInstructions",
    value: function setInstructions(_ref) {
      var desktop = _ref.desktop,
          mobile = _ref.mobile;

      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
        // show mobile instructions
        this.instructions.textContent = mobile;
      } else {
        // show desktop instructions
        this.instructions.textContent = desktop;
      }

      this.show('instructions');
    }
  }, {
    key: "hideInstructions",
    value: function hideInstructions() {
      this.hide('instructions');
    }
  }, {
    key: "showStats",
    value: function showStats() {
      this.show('score1');
      this.show('score2');
    }
  }, {
    key: "setScore1",
    value: function setScore1(score) {
      this.score1.textContent = "P1: ".concat(score);
    }
  }, {
    key: "setScore2",
    value: function setScore2(score) {
      this.score2.textContent = "P2: ".concat(score);
    }
  }, {
    key: "setStyles",
    value: function setStyles(styles) {
      this.styles = _objectSpread({}, this.styles, {}, styles);
      this.applyStyles();
    }
  }, {
    key: "applyStyles",
    value: function applyStyles() {
      this.container.style.color = this.styles.textColor;
      this.container.style.fontFamily = this.styles.fontFamily;
      this.button.style.backgroundColor = this.styles.primaryColor;
    }
  }, {
    key: "setMute",
    value: function setMute(muted) {
      this.mute.textContent = muted ? 'volume_off' : 'volume_up';
      this.show('mute');
    }
  }, {
    key: "setPause",
    value: function setPause(paused) {
      this.pause.textContent = paused ? 'play_arrow' : 'pause';
      this.show('pause');
    }
  }, {
    key: "show",
    value: function show(node) {
      this[node].active = true;
      this[node].style.visibility = 'visible';
      this[node].style.opacity = 1;
    }
  }, {
    key: "hide",
    value: function hide(node) {
      this[node].active = false;
      this[node].style.opacity = 0;
      this[node].style.visibility = 'hidden';
    }
  }]);

  return Overlay;
}();

var _default = Overlay;
exports.default = _default;
},{}],"index.js":[function(require,module,exports) {
"use strict";

var _main = _interopRequireDefault(require("./game/main.js"));

var _overlay = _interopRequireDefault(require("./game/overlay.js"));

var _kojiTools = _interopRequireDefault(require("koji-tools"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * index.js
 * 
 * What it Does:
 *   This file gets the #gameScreen and #gameOverlay elements in index.html,
 *   attaches a new game and a overlay to them, and starts the game.
 *   It also loads the .internals/config.json which is a bundle of current customization
 *   to the json files in the .koji directory
 * 
 * How to Use:
 *   Make sure this file has a script tag in index.html
 *   eg. <script src="./index.js"></script>
 */
// import Game and Overlay
// import Koji
_kojiTools.default.pageLoad(); // create get the gameScreen and gameOverlay elements
// gameScreen is the <canvas> element where the game is displayed
// gameOverlay is where the where start button, score, lives,
// play and pause buttons etc will be displayed


var gameScreen = document.getElementById("gameScreen");
var gameOverlay = document.getElementById("gameOverlay");
var topbar = document.getElementById("topBar"); // create new overlay for game
// create new game and load it

var config = _kojiTools.default.config;
var overlay = new _overlay.default(gameOverlay);
var game = new _main.default(gameScreen, overlay, topbar, config);
game.load();
},{"./game/main.js":"game/main.js","./game/overlay.js":"game/overlay.js","koji-tools":"node_modules/koji-tools/index.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "49580" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/baseball.e31bb0bc.js.map