var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __moduleCache = /* @__PURE__ */ new WeakMap;
var __toCommonJS = (from) => {
  var entry = __moduleCache.get(from), desc;
  if (entry)
    return entry;
  entry = __defProp({}, "__esModule", { value: true });
  if (from && typeof from === "object" || typeof from === "function")
    __getOwnPropNames(from).map((key) => !__hasOwnProp.call(entry, key) && __defProp(entry, key, {
      get: () => from[key],
      enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
    }));
  __moduleCache.set(from, entry);
  return entry;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
};
var __esm = (fn, res) => () => (fn && (res = fn(fn = 0)), res);
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// node:path
var exports_path = {};
__export(exports_path, {
  sep: () => sep,
  resolve: () => resolve,
  relative: () => relative,
  posix: () => posix,
  parse: () => parse,
  normalize: () => normalize,
  join: () => join,
  isAbsolute: () => isAbsolute,
  format: () => format,
  extname: () => extname,
  dirname: () => dirname,
  delimiter: () => delimiter,
  default: () => path_default,
  basename: () => basename,
  _makeLong: () => _makeLong
});
function assertPath(path) {
  if (typeof path !== "string")
    throw new TypeError("Path must be a string. Received " + JSON.stringify(path));
}
function normalizeStringPosix(path, allowAboveRoot) {
  var res = "", lastSegmentLength = 0, lastSlash = -1, dots = 0, code;
  for (var i = 0;i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47)
      break;
    else
      code = 47;
    if (code === 47) {
      if (lastSlash === i - 1 || dots === 1)
        ;
      else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 || res.charCodeAt(res.length - 2) !== 46) {
          if (res.length > 2) {
            var lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1)
                res = "", lastSegmentLength = 0;
              else
                res = res.slice(0, lastSlashIndex), lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
              lastSlash = i, dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = "", lastSegmentLength = 0, lastSlash = i, dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += "/..";
          else
            res = "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += "/" + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i, dots = 0;
    } else if (code === 46 && dots !== -1)
      ++dots;
    else
      dots = -1;
  }
  return res;
}
function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root, base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
  if (!dir)
    return base;
  if (dir === pathObject.root)
    return dir + base;
  return dir + sep + base;
}
function resolve() {
  var resolvedPath = "", resolvedAbsolute = false, cwd;
  for (var i = arguments.length - 1;i >= -1 && !resolvedAbsolute; i--) {
    var path;
    if (i >= 0)
      path = arguments[i];
    else {
      if (cwd === undefined)
        cwd = process.cwd();
      path = cwd;
    }
    if (assertPath(path), path.length === 0)
      continue;
    resolvedPath = path + "/" + resolvedPath, resolvedAbsolute = path.charCodeAt(0) === 47;
  }
  if (resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute), resolvedAbsolute)
    if (resolvedPath.length > 0)
      return "/" + resolvedPath;
    else
      return "/";
  else if (resolvedPath.length > 0)
    return resolvedPath;
  else
    return ".";
}
function normalize(path) {
  if (assertPath(path), path.length === 0)
    return ".";
  var isAbsolute = path.charCodeAt(0) === 47, trailingSeparator = path.charCodeAt(path.length - 1) === 47;
  if (path = normalizeStringPosix(path, !isAbsolute), path.length === 0 && !isAbsolute)
    path = ".";
  if (path.length > 0 && trailingSeparator)
    path += "/";
  if (isAbsolute)
    return "/" + path;
  return path;
}
function isAbsolute(path) {
  return assertPath(path), path.length > 0 && path.charCodeAt(0) === 47;
}
function join() {
  if (arguments.length === 0)
    return ".";
  var joined;
  for (var i = 0;i < arguments.length; ++i) {
    var arg = arguments[i];
    if (assertPath(arg), arg.length > 0)
      if (joined === undefined)
        joined = arg;
      else
        joined += "/" + arg;
  }
  if (joined === undefined)
    return ".";
  return normalize(joined);
}
function relative(from, to) {
  if (assertPath(from), assertPath(to), from === to)
    return "";
  if (from = resolve(from), to = resolve(to), from === to)
    return "";
  var fromStart = 1;
  for (;fromStart < from.length; ++fromStart)
    if (from.charCodeAt(fromStart) !== 47)
      break;
  var fromEnd = from.length, fromLen = fromEnd - fromStart, toStart = 1;
  for (;toStart < to.length; ++toStart)
    if (to.charCodeAt(toStart) !== 47)
      break;
  var toEnd = to.length, toLen = toEnd - toStart, length = fromLen < toLen ? fromLen : toLen, lastCommonSep = -1, i = 0;
  for (;i <= length; ++i) {
    if (i === length) {
      if (toLen > length) {
        if (to.charCodeAt(toStart + i) === 47)
          return to.slice(toStart + i + 1);
        else if (i === 0)
          return to.slice(toStart + i);
      } else if (fromLen > length) {
        if (from.charCodeAt(fromStart + i) === 47)
          lastCommonSep = i;
        else if (i === 0)
          lastCommonSep = 0;
      }
      break;
    }
    var fromCode = from.charCodeAt(fromStart + i), toCode = to.charCodeAt(toStart + i);
    if (fromCode !== toCode)
      break;
    else if (fromCode === 47)
      lastCommonSep = i;
  }
  var out = "";
  for (i = fromStart + lastCommonSep + 1;i <= fromEnd; ++i)
    if (i === fromEnd || from.charCodeAt(i) === 47)
      if (out.length === 0)
        out += "..";
      else
        out += "/..";
  if (out.length > 0)
    return out + to.slice(toStart + lastCommonSep);
  else {
    if (toStart += lastCommonSep, to.charCodeAt(toStart) === 47)
      ++toStart;
    return to.slice(toStart);
  }
}
function _makeLong(path) {
  return path;
}
function dirname(path) {
  if (assertPath(path), path.length === 0)
    return ".";
  var code = path.charCodeAt(0), hasRoot = code === 47, end = -1, matchedSlash = true;
  for (var i = path.length - 1;i >= 1; --i)
    if (code = path.charCodeAt(i), code === 47) {
      if (!matchedSlash) {
        end = i;
        break;
      }
    } else
      matchedSlash = false;
  if (end === -1)
    return hasRoot ? "/" : ".";
  if (hasRoot && end === 1)
    return "//";
  return path.slice(0, end);
}
function basename(path, ext) {
  if (ext !== undefined && typeof ext !== "string")
    throw new TypeError('"ext" argument must be a string');
  assertPath(path);
  var start = 0, end = -1, matchedSlash = true, i;
  if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
    if (ext.length === path.length && ext === path)
      return "";
    var extIdx = ext.length - 1, firstNonSlashEnd = -1;
    for (i = path.length - 1;i >= 0; --i) {
      var code = path.charCodeAt(i);
      if (code === 47) {
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else {
        if (firstNonSlashEnd === -1)
          matchedSlash = false, firstNonSlashEnd = i + 1;
        if (extIdx >= 0)
          if (code === ext.charCodeAt(extIdx)) {
            if (--extIdx === -1)
              end = i;
          } else
            extIdx = -1, end = firstNonSlashEnd;
      }
    }
    if (start === end)
      end = firstNonSlashEnd;
    else if (end === -1)
      end = path.length;
    return path.slice(start, end);
  } else {
    for (i = path.length - 1;i >= 0; --i)
      if (path.charCodeAt(i) === 47) {
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1)
        matchedSlash = false, end = i + 1;
    if (end === -1)
      return "";
    return path.slice(start, end);
  }
}
function extname(path) {
  assertPath(path);
  var startDot = -1, startPart = 0, end = -1, matchedSlash = true, preDotState = 0;
  for (var i = path.length - 1;i >= 0; --i) {
    var code = path.charCodeAt(i);
    if (code === 47) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1)
      matchedSlash = false, end = i + 1;
    if (code === 46) {
      if (startDot === -1)
        startDot = i;
      else if (preDotState !== 1)
        preDotState = 1;
    } else if (startDot !== -1)
      preDotState = -1;
  }
  if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1)
    return "";
  return path.slice(startDot, end);
}
function format(pathObject) {
  if (pathObject === null || typeof pathObject !== "object")
    throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
  return _format("/", pathObject);
}
function parse(path) {
  assertPath(path);
  var ret = { root: "", dir: "", base: "", ext: "", name: "" };
  if (path.length === 0)
    return ret;
  var code = path.charCodeAt(0), isAbsolute2 = code === 47, start;
  if (isAbsolute2)
    ret.root = "/", start = 1;
  else
    start = 0;
  var startDot = -1, startPart = 0, end = -1, matchedSlash = true, i = path.length - 1, preDotState = 0;
  for (;i >= start; --i) {
    if (code = path.charCodeAt(i), code === 47) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1)
      matchedSlash = false, end = i + 1;
    if (code === 46) {
      if (startDot === -1)
        startDot = i;
      else if (preDotState !== 1)
        preDotState = 1;
    } else if (startDot !== -1)
      preDotState = -1;
  }
  if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    if (end !== -1)
      if (startPart === 0 && isAbsolute2)
        ret.base = ret.name = path.slice(1, end);
      else
        ret.base = ret.name = path.slice(startPart, end);
  } else {
    if (startPart === 0 && isAbsolute2)
      ret.name = path.slice(1, startDot), ret.base = path.slice(1, end);
    else
      ret.name = path.slice(startPart, startDot), ret.base = path.slice(startPart, end);
    ret.ext = path.slice(startDot, end);
  }
  if (startPart > 0)
    ret.dir = path.slice(0, startPart - 1);
  else if (isAbsolute2)
    ret.dir = "/";
  return ret;
}
var sep = "/", delimiter = ":", posix, path_default;
var init_path = __esm(() => {
  posix = ((p) => (p.posix = p, p))({ resolve, normalize, isAbsolute, join, relative, _makeLong, dirname, basename, extname, format, parse, sep, delimiter, win32: null, posix: null });
  path_default = posix;
});

// ../../node_modules/ejs/lib/utils.js
var require_utils = __commonJS((exports) => {
  var regExpChars = /[|\\{}()[\]^$+*?.]/g;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var hasOwn = function(obj, key) {
    return hasOwnProperty.apply(obj, [key]);
  };
  exports.escapeRegExpChars = function(string) {
    if (!string) {
      return "";
    }
    return String(string).replace(regExpChars, "\\$&");
  };
  var _ENCODE_HTML_RULES = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&#34;",
    "'": "&#39;"
  };
  var _MATCH_HTML = /[&<>'"]/g;
  function encode_char(c) {
    return _ENCODE_HTML_RULES[c] || c;
  }
  var escapeFuncStr = `var _ENCODE_HTML_RULES = {
` + `      "&": "&amp;"
` + `    , "<": "&lt;"
` + `    , ">": "&gt;"
` + `    , '"': "&#34;"
` + `    , "'": "&#39;"
` + `    }
` + `  , _MATCH_HTML = /[&<>'"]/g;
` + `function encode_char(c) {
` + `  return _ENCODE_HTML_RULES[c] || c;
` + `};
`;
  exports.escapeXML = function(markup) {
    return markup == undefined ? "" : String(markup).replace(_MATCH_HTML, encode_char);
  };
  function escapeXMLToString() {
    return Function.prototype.toString.call(this) + `;
` + escapeFuncStr;
  }
  try {
    if (typeof Object.defineProperty === "function") {
      Object.defineProperty(exports.escapeXML, "toString", { value: escapeXMLToString });
    } else {
      exports.escapeXML.toString = escapeXMLToString;
    }
  } catch (err) {
    console.warn("Unable to set escapeXML.toString (is the Function prototype frozen?)");
  }
  exports.shallowCopy = function(to, from) {
    from = from || {};
    if (to !== null && to !== undefined) {
      for (var p in from) {
        if (!hasOwn(from, p)) {
          continue;
        }
        if (p === "__proto__" || p === "constructor") {
          continue;
        }
        to[p] = from[p];
      }
    }
    return to;
  };
  exports.shallowCopyFromList = function(to, from, list) {
    list = list || [];
    from = from || {};
    if (to !== null && to !== undefined) {
      for (var i = 0;i < list.length; i++) {
        var p = list[i];
        if (typeof from[p] != "undefined") {
          if (!hasOwn(from, p)) {
            continue;
          }
          if (p === "__proto__" || p === "constructor") {
            continue;
          }
          to[p] = from[p];
        }
      }
    }
    return to;
  };
  exports.cache = {
    _data: {},
    set: function(key, val) {
      this._data[key] = val;
    },
    get: function(key) {
      return this._data[key];
    },
    remove: function(key) {
      delete this._data[key];
    },
    reset: function() {
      this._data = {};
    }
  };
  exports.hyphenToCamel = function(str) {
    return str.replace(/-[a-z]/g, function(match) {
      return match[1].toUpperCase();
    });
  };
  exports.createNullProtoObjWherePossible = function() {
    if (typeof Object.create == "function") {
      return function() {
        return Object.create(null);
      };
    }
    if (!({ __proto__: null } instanceof Object)) {
      return function() {
        return { __proto__: null };
      };
    }
    return function() {
      return {};
    };
  }();
  exports.hasOwnOnlyObject = function(obj) {
    var o = exports.createNullProtoObjWherePossible();
    for (var p in obj) {
      if (hasOwn(obj, p)) {
        o[p] = obj[p];
      }
    }
    return o;
  };
});

// ../../node_modules/ejs/package.json
var require_package = __commonJS((exports, module) => {
  module.exports = {
    name: "ejs",
    description: "Embedded JavaScript templates",
    keywords: [
      "template",
      "engine",
      "ejs"
    ],
    version: "3.1.10",
    author: "Matthew Eernisse <mde@fleegix.org> (http://fleegix.org)",
    license: "Apache-2.0",
    bin: {
      ejs: "./bin/cli.js"
    },
    main: "./lib/ejs.js",
    jsdelivr: "ejs.min.js",
    unpkg: "ejs.min.js",
    repository: {
      type: "git",
      url: "git://github.com/mde/ejs.git"
    },
    bugs: "https://github.com/mde/ejs/issues",
    homepage: "https://github.com/mde/ejs",
    dependencies: {
      jake: "^10.8.5"
    },
    devDependencies: {
      browserify: "^16.5.1",
      eslint: "^6.8.0",
      "git-directory-deploy": "^1.5.1",
      jsdoc: "^4.0.2",
      "lru-cache": "^4.0.1",
      mocha: "^10.2.0",
      "uglify-js": "^3.3.16"
    },
    engines: {
      node: ">=0.10.0"
    },
    scripts: {
      test: "npx jake test"
    }
  };
});

// ../../node_modules/ejs/lib/ejs.js
var require_ejs = __commonJS((exports) => {
  var fs = (() => ({}));
  var path = (init_path(), __toCommonJS(exports_path));
  var utils = require_utils();
  var scopeOptionWarned = false;
  var _VERSION_STRING = require_package().version;
  var _DEFAULT_OPEN_DELIMITER = "<";
  var _DEFAULT_CLOSE_DELIMITER = ">";
  var _DEFAULT_DELIMITER = "%";
  var _DEFAULT_LOCALS_NAME = "locals";
  var _NAME = "ejs";
  var _REGEX_STRING = "(<%%|%%>|<%=|<%-|<%_|<%#|<%|%>|-%>|_%>)";
  var _OPTS_PASSABLE_WITH_DATA = [
    "delimiter",
    "scope",
    "context",
    "debug",
    "compileDebug",
    "client",
    "_with",
    "rmWhitespace",
    "strict",
    "filename",
    "async"
  ];
  var _OPTS_PASSABLE_WITH_DATA_EXPRESS = _OPTS_PASSABLE_WITH_DATA.concat("cache");
  var _BOM = /^\uFEFF/;
  var _JS_IDENTIFIER = /^[a-zA-Z_$][0-9a-zA-Z_$]*$/;
  exports.cache = utils.cache;
  exports.fileLoader = fs.readFileSync;
  exports.localsName = _DEFAULT_LOCALS_NAME;
  exports.promiseImpl = new Function("return this;")().Promise;
  exports.resolveInclude = function(name, filename, isDir) {
    var dirname2 = path.dirname;
    var extname2 = path.extname;
    var resolve2 = path.resolve;
    var includePath = resolve2(isDir ? filename : dirname2(filename), name);
    var ext = extname2(name);
    if (!ext) {
      includePath += ".ejs";
    }
    return includePath;
  };
  function resolvePaths(name, paths) {
    var filePath;
    if (paths.some(function(v) {
      filePath = exports.resolveInclude(name, v, true);
      return fs.existsSync(filePath);
    })) {
      return filePath;
    }
  }
  function getIncludePath(path2, options) {
    var includePath;
    var filePath;
    var views = options.views;
    var match = /^[A-Za-z]+:\\|^\//.exec(path2);
    if (match && match.length) {
      path2 = path2.replace(/^\/*/, "");
      if (Array.isArray(options.root)) {
        includePath = resolvePaths(path2, options.root);
      } else {
        includePath = exports.resolveInclude(path2, options.root || "/", true);
      }
    } else {
      if (options.filename) {
        filePath = exports.resolveInclude(path2, options.filename);
        if (fs.existsSync(filePath)) {
          includePath = filePath;
        }
      }
      if (!includePath && Array.isArray(views)) {
        includePath = resolvePaths(path2, views);
      }
      if (!includePath && typeof options.includer !== "function") {
        throw new Error('Could not find the include file "' + options.escapeFunction(path2) + '"');
      }
    }
    return includePath;
  }
  function handleCache(options, template) {
    var func;
    var filename = options.filename;
    var hasTemplate = arguments.length > 1;
    if (options.cache) {
      if (!filename) {
        throw new Error("cache option requires a filename");
      }
      func = exports.cache.get(filename);
      if (func) {
        return func;
      }
      if (!hasTemplate) {
        template = fileLoader(filename).toString().replace(_BOM, "");
      }
    } else if (!hasTemplate) {
      if (!filename) {
        throw new Error("Internal EJS error: no file name or template " + "provided");
      }
      template = fileLoader(filename).toString().replace(_BOM, "");
    }
    func = exports.compile(template, options);
    if (options.cache) {
      exports.cache.set(filename, func);
    }
    return func;
  }
  function tryHandleCache(options, data, cb) {
    var result;
    if (!cb) {
      if (typeof exports.promiseImpl == "function") {
        return new exports.promiseImpl(function(resolve2, reject) {
          try {
            result = handleCache(options)(data);
            resolve2(result);
          } catch (err) {
            reject(err);
          }
        });
      } else {
        throw new Error("Please provide a callback function");
      }
    } else {
      try {
        result = handleCache(options)(data);
      } catch (err) {
        return cb(err);
      }
      cb(null, result);
    }
  }
  function fileLoader(filePath) {
    return exports.fileLoader(filePath);
  }
  function includeFile(path2, options) {
    var opts = utils.shallowCopy(utils.createNullProtoObjWherePossible(), options);
    opts.filename = getIncludePath(path2, opts);
    if (typeof options.includer === "function") {
      var includerResult = options.includer(path2, opts.filename);
      if (includerResult) {
        if (includerResult.filename) {
          opts.filename = includerResult.filename;
        }
        if (includerResult.template) {
          return handleCache(opts, includerResult.template);
        }
      }
    }
    return handleCache(opts);
  }
  function rethrow(err, str, flnm, lineno, esc) {
    var lines = str.split(`
`);
    var start = Math.max(lineno - 3, 0);
    var end = Math.min(lines.length, lineno + 3);
    var filename = esc(flnm);
    var context = lines.slice(start, end).map(function(line, i) {
      var curr = i + start + 1;
      return (curr == lineno ? " >> " : "    ") + curr + "| " + line;
    }).join(`
`);
    err.path = filename;
    err.message = (filename || "ejs") + ":" + lineno + `
` + context + `

` + err.message;
    throw err;
  }
  function stripSemi(str) {
    return str.replace(/;(\s*$)/, "$1");
  }
  exports.compile = function compile(template, opts) {
    var templ;
    if (opts && opts.scope) {
      if (!scopeOptionWarned) {
        console.warn("`scope` option is deprecated and will be removed in EJS 3");
        scopeOptionWarned = true;
      }
      if (!opts.context) {
        opts.context = opts.scope;
      }
      delete opts.scope;
    }
    templ = new Template(template, opts);
    return templ.compile();
  };
  exports.render = function(template, d, o) {
    var data = d || utils.createNullProtoObjWherePossible();
    var opts = o || utils.createNullProtoObjWherePossible();
    if (arguments.length == 2) {
      utils.shallowCopyFromList(opts, data, _OPTS_PASSABLE_WITH_DATA);
    }
    return handleCache(opts, template)(data);
  };
  exports.renderFile = function() {
    var args = Array.prototype.slice.call(arguments);
    var filename = args.shift();
    var cb;
    var opts = { filename };
    var data;
    var viewOpts;
    if (typeof arguments[arguments.length - 1] == "function") {
      cb = args.pop();
    }
    if (args.length) {
      data = args.shift();
      if (args.length) {
        utils.shallowCopy(opts, args.pop());
      } else {
        if (data.settings) {
          if (data.settings.views) {
            opts.views = data.settings.views;
          }
          if (data.settings["view cache"]) {
            opts.cache = true;
          }
          viewOpts = data.settings["view options"];
          if (viewOpts) {
            utils.shallowCopy(opts, viewOpts);
          }
        }
        utils.shallowCopyFromList(opts, data, _OPTS_PASSABLE_WITH_DATA_EXPRESS);
      }
      opts.filename = filename;
    } else {
      data = utils.createNullProtoObjWherePossible();
    }
    return tryHandleCache(opts, data, cb);
  };
  exports.Template = Template;
  exports.clearCache = function() {
    exports.cache.reset();
  };
  function Template(text, optsParam) {
    var opts = utils.hasOwnOnlyObject(optsParam);
    var options = utils.createNullProtoObjWherePossible();
    this.templateText = text;
    this.mode = null;
    this.truncate = false;
    this.currentLine = 1;
    this.source = "";
    options.client = opts.client || false;
    options.escapeFunction = opts.escape || opts.escapeFunction || utils.escapeXML;
    options.compileDebug = opts.compileDebug !== false;
    options.debug = !!opts.debug;
    options.filename = opts.filename;
    options.openDelimiter = opts.openDelimiter || exports.openDelimiter || _DEFAULT_OPEN_DELIMITER;
    options.closeDelimiter = opts.closeDelimiter || exports.closeDelimiter || _DEFAULT_CLOSE_DELIMITER;
    options.delimiter = opts.delimiter || exports.delimiter || _DEFAULT_DELIMITER;
    options.strict = opts.strict || false;
    options.context = opts.context;
    options.cache = opts.cache || false;
    options.rmWhitespace = opts.rmWhitespace;
    options.root = opts.root;
    options.includer = opts.includer;
    options.outputFunctionName = opts.outputFunctionName;
    options.localsName = opts.localsName || exports.localsName || _DEFAULT_LOCALS_NAME;
    options.views = opts.views;
    options.async = opts.async;
    options.destructuredLocals = opts.destructuredLocals;
    options.legacyInclude = typeof opts.legacyInclude != "undefined" ? !!opts.legacyInclude : true;
    if (options.strict) {
      options._with = false;
    } else {
      options._with = typeof opts._with != "undefined" ? opts._with : true;
    }
    this.opts = options;
    this.regex = this.createRegex();
  }
  Template.modes = {
    EVAL: "eval",
    ESCAPED: "escaped",
    RAW: "raw",
    COMMENT: "comment",
    LITERAL: "literal"
  };
  Template.prototype = {
    createRegex: function() {
      var str = _REGEX_STRING;
      var delim = utils.escapeRegExpChars(this.opts.delimiter);
      var open = utils.escapeRegExpChars(this.opts.openDelimiter);
      var close = utils.escapeRegExpChars(this.opts.closeDelimiter);
      str = str.replace(/%/g, delim).replace(/</g, open).replace(/>/g, close);
      return new RegExp(str);
    },
    compile: function() {
      var src;
      var fn;
      var opts = this.opts;
      var prepended = "";
      var appended = "";
      var escapeFn = opts.escapeFunction;
      var ctor;
      var sanitizedFilename = opts.filename ? JSON.stringify(opts.filename) : "undefined";
      if (!this.source) {
        this.generateSource();
        prepended += `  var __output = "";
` + `  function __append(s) { if (s !== undefined && s !== null) __output += s }
`;
        if (opts.outputFunctionName) {
          if (!_JS_IDENTIFIER.test(opts.outputFunctionName)) {
            throw new Error("outputFunctionName is not a valid JS identifier.");
          }
          prepended += "  var " + opts.outputFunctionName + " = __append;" + `
`;
        }
        if (opts.localsName && !_JS_IDENTIFIER.test(opts.localsName)) {
          throw new Error("localsName is not a valid JS identifier.");
        }
        if (opts.destructuredLocals && opts.destructuredLocals.length) {
          var destructuring = "  var __locals = (" + opts.localsName + ` || {}),
`;
          for (var i = 0;i < opts.destructuredLocals.length; i++) {
            var name = opts.destructuredLocals[i];
            if (!_JS_IDENTIFIER.test(name)) {
              throw new Error("destructuredLocals[" + i + "] is not a valid JS identifier.");
            }
            if (i > 0) {
              destructuring += `,
  `;
            }
            destructuring += name + " = __locals." + name;
          }
          prepended += destructuring + `;
`;
        }
        if (opts._with !== false) {
          prepended += "  with (" + opts.localsName + " || {}) {" + `
`;
          appended += "  }" + `
`;
        }
        appended += "  return __output;" + `
`;
        this.source = prepended + this.source + appended;
      }
      if (opts.compileDebug) {
        src = "var __line = 1" + `
` + "  , __lines = " + JSON.stringify(this.templateText) + `
` + "  , __filename = " + sanitizedFilename + ";" + `
` + "try {" + `
` + this.source + "} catch (e) {" + `
` + "  rethrow(e, __lines, __filename, __line, escapeFn);" + `
` + "}" + `
`;
      } else {
        src = this.source;
      }
      if (opts.client) {
        src = "escapeFn = escapeFn || " + escapeFn.toString() + ";" + `
` + src;
        if (opts.compileDebug) {
          src = "rethrow = rethrow || " + rethrow.toString() + ";" + `
` + src;
        }
      }
      if (opts.strict) {
        src = `"use strict";
` + src;
      }
      if (opts.debug) {
        console.log(src);
      }
      if (opts.compileDebug && opts.filename) {
        src = src + `
` + "//# sourceURL=" + sanitizedFilename + `
`;
      }
      try {
        if (opts.async) {
          try {
            ctor = new Function("return (async function(){}).constructor;")();
          } catch (e) {
            if (e instanceof SyntaxError) {
              throw new Error("This environment does not support async/await");
            } else {
              throw e;
            }
          }
        } else {
          ctor = Function;
        }
        fn = new ctor(opts.localsName + ", escapeFn, include, rethrow", src);
      } catch (e) {
        if (e instanceof SyntaxError) {
          if (opts.filename) {
            e.message += " in " + opts.filename;
          }
          e.message += ` while compiling ejs

`;
          e.message += `If the above error is not helpful, you may want to try EJS-Lint:
`;
          e.message += "https://github.com/RyanZim/EJS-Lint";
          if (!opts.async) {
            e.message += `
`;
            e.message += "Or, if you meant to create an async function, pass `async: true` as an option.";
          }
        }
        throw e;
      }
      var returnedFn = opts.client ? fn : function anonymous(data) {
        var include = function(path2, includeData) {
          var d = utils.shallowCopy(utils.createNullProtoObjWherePossible(), data);
          if (includeData) {
            d = utils.shallowCopy(d, includeData);
          }
          return includeFile(path2, opts)(d);
        };
        return fn.apply(opts.context, [data || utils.createNullProtoObjWherePossible(), escapeFn, include, rethrow]);
      };
      if (opts.filename && typeof Object.defineProperty === "function") {
        var filename = opts.filename;
        var basename2 = path.basename(filename, path.extname(filename));
        try {
          Object.defineProperty(returnedFn, "name", {
            value: basename2,
            writable: false,
            enumerable: false,
            configurable: true
          });
        } catch (e) {}
      }
      return returnedFn;
    },
    generateSource: function() {
      var opts = this.opts;
      if (opts.rmWhitespace) {
        this.templateText = this.templateText.replace(/[\r\n]+/g, `
`).replace(/^\s+|\s+$/gm, "");
      }
      this.templateText = this.templateText.replace(/[ \t]*<%_/gm, "<%_").replace(/_%>[ \t]*/gm, "_%>");
      var self = this;
      var matches = this.parseTemplateText();
      var d = this.opts.delimiter;
      var o = this.opts.openDelimiter;
      var c = this.opts.closeDelimiter;
      if (matches && matches.length) {
        matches.forEach(function(line, index) {
          var closing;
          if (line.indexOf(o + d) === 0 && line.indexOf(o + d + d) !== 0) {
            closing = matches[index + 2];
            if (!(closing == d + c || closing == "-" + d + c || closing == "_" + d + c)) {
              throw new Error('Could not find matching close tag for "' + line + '".');
            }
          }
          self.scanLine(line);
        });
      }
    },
    parseTemplateText: function() {
      var str = this.templateText;
      var pat = this.regex;
      var result = pat.exec(str);
      var arr = [];
      var firstPos;
      while (result) {
        firstPos = result.index;
        if (firstPos !== 0) {
          arr.push(str.substring(0, firstPos));
          str = str.slice(firstPos);
        }
        arr.push(result[0]);
        str = str.slice(result[0].length);
        result = pat.exec(str);
      }
      if (str) {
        arr.push(str);
      }
      return arr;
    },
    _addOutput: function(line) {
      if (this.truncate) {
        line = line.replace(/^(?:\r\n|\r|\n)/, "");
        this.truncate = false;
      }
      if (!line) {
        return line;
      }
      line = line.replace(/\\/g, "\\\\");
      line = line.replace(/\n/g, "\\n");
      line = line.replace(/\r/g, "\\r");
      line = line.replace(/"/g, "\\\"");
      this.source += '    ; __append("' + line + '")' + `
`;
    },
    scanLine: function(line) {
      var self = this;
      var d = this.opts.delimiter;
      var o = this.opts.openDelimiter;
      var c = this.opts.closeDelimiter;
      var newLineCount = 0;
      newLineCount = line.split(`
`).length - 1;
      switch (line) {
        case o + d:
        case o + d + "_":
          this.mode = Template.modes.EVAL;
          break;
        case o + d + "=":
          this.mode = Template.modes.ESCAPED;
          break;
        case o + d + "-":
          this.mode = Template.modes.RAW;
          break;
        case o + d + "#":
          this.mode = Template.modes.COMMENT;
          break;
        case o + d + d:
          this.mode = Template.modes.LITERAL;
          this.source += '    ; __append("' + line.replace(o + d + d, o + d) + '")' + `
`;
          break;
        case d + d + c:
          this.mode = Template.modes.LITERAL;
          this.source += '    ; __append("' + line.replace(d + d + c, d + c) + '")' + `
`;
          break;
        case d + c:
        case "-" + d + c:
        case "_" + d + c:
          if (this.mode == Template.modes.LITERAL) {
            this._addOutput(line);
          }
          this.mode = null;
          this.truncate = line.indexOf("-") === 0 || line.indexOf("_") === 0;
          break;
        default:
          if (this.mode) {
            switch (this.mode) {
              case Template.modes.EVAL:
              case Template.modes.ESCAPED:
              case Template.modes.RAW:
                if (line.lastIndexOf("//") > line.lastIndexOf(`
`)) {
                  line += `
`;
                }
            }
            switch (this.mode) {
              case Template.modes.EVAL:
                this.source += "    ; " + line + `
`;
                break;
              case Template.modes.ESCAPED:
                this.source += "    ; __append(escapeFn(" + stripSemi(line) + "))" + `
`;
                break;
              case Template.modes.RAW:
                this.source += "    ; __append(" + stripSemi(line) + ")" + `
`;
                break;
              case Template.modes.COMMENT:
                break;
              case Template.modes.LITERAL:
                this._addOutput(line);
                break;
            }
          } else {
            this._addOutput(line);
          }
      }
      if (self.opts.compileDebug && newLineCount) {
        this.currentLine += newLineCount;
        this.source += "    ; __line = " + this.currentLine + `
`;
      }
    }
  };
  exports.escapeXML = utils.escapeXML;
  exports.__express = exports.renderFile;
  exports.VERSION = _VERSION_STRING;
  exports.name = _NAME;
  if (typeof window != "undefined") {
    window.ejs = exports;
  }
});

// index.ts
var import_ejs = __toESM(require_ejs(), 1);
init_path();
import { defineIntegration, Response } from "gaman";
var {readFile} = (() => ({}));
var gaman_ejs_default = defineIntegration({
  name: "ejs",
  priority: "normal",
  async onRender(app, ctx, res) {
    const filePath = join(process.cwd(), "test/views", `${res.viewName}.ejs`);
    const templateContent = await readFile(filePath, "utf-8");
    const rendered = import_ejs.default.render(templateContent, res.viewData);
    return Response.html(rendered, { status: 200 });
  }
});
export {
  gaman_ejs_default as default
};
