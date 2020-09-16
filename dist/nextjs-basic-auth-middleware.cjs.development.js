'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var auth = _interopDefault(require('basic-auth'));
var compare = _interopDefault(require('tsscmp'));
var url = require('url');

var parseCredentials = function parseCredentials(credentials) {
  var authCredentials = [];
  credentials.split('|').forEach(function (item) {
    if (item.length < 3) {
      throw new Error("Received incorrect basic auth syntax, use <username>:<password>, received " + item);
    }

    var parsedCredentials = item.split(':');

    if (parsedCredentials[0].length === 0 || parsedCredentials[1].length === 0) {
      throw new Error("Received incorrect basic auth syntax, use <username>:<password>, received " + item);
    }

    authCredentials.push({
      name: parsedCredentials[0],
      password: parsedCredentials[1]
    });
  });
  return authCredentials;
};
/**
 * Compares the basic auth credentials with the configured user and password
 * @param credentials Basic Auth credentials object from `basic-auth`
 */

var compareCredentials = function compareCredentials(user, requiredCredentials) {
  var valid = false;
  requiredCredentials.forEach(function (item) {
    if (compare(item.name, user.name) && compare(item.password, user.pass)) {
      valid = true;
    }
  });
  return valid;
};

var pathInRequest = function pathInRequest(paths, req) {
  if (req.url === undefined) {
    console.log('request url is undefined');
    return false;
  }

  var path = url.parse(req.url).pathname;
  return paths.some(function (item) {
    return path === null || path === void 0 ? void 0 : path.startsWith(item);
  });
};

/**
 * Middleware that sends a basic auth challenge to the user when enabled
 * @param req Http server incoming message
 * @param res Server response
 */

var basicAuthMiddleware = function basicAuthMiddleware(req, res, _ref) {
  var _ref$realm = _ref.realm,
      realm = _ref$realm === void 0 ? 'protected' : _ref$realm,
      _ref$users = _ref.users,
      users = _ref$users === void 0 ? [] : _ref$users,
      _ref$includePaths = _ref.includePaths,
      includePaths = _ref$includePaths === void 0 ? ['/'] : _ref$includePaths,
      _ref$excludePaths = _ref.excludePaths,
      excludePaths = _ref$excludePaths === void 0 ? [] : _ref$excludePaths;

  try {
    // Check if credentials are set up
    var environmentCredentials = process.env.BASIC_AUTH_CREDENTIALS || '';

    if (environmentCredentials.length === 0 && users.length === 0) {
      // No credentials set up, continue rendering the page as normal
      return Promise.resolve();
    } // Retrieve paths from environment credentials or use arguments


    var includeAuth = process.env.BASIC_AUTH_PATHS ? process.env.BASIC_AUTH_PATHS.split(';') : includePaths;
    var excludeAuth = process.env.BASIC_AUTH_EXCLUDE_PATHS ? process.env.BASIC_AUTH_EXCLUDE_PATHS.split(';') : excludePaths; // Check whether the path of the request should even be checked

    if (pathInRequest(excludeAuth, req) || !pathInRequest(includeAuth, req)) {
      // Current path not part of the checked settings
      return Promise.resolve();
    }

    var credentialsObject = environmentCredentials.length > 0 ? parseCredentials(environmentCredentials) : users;
    var currentUser = auth(req);

    if (!currentUser || !compareCredentials(currentUser, credentialsObject)) {
      res.statusCode = 401;
      res.setHeader('WWW-Authenticate', "Basic realm=\"" + realm + "\"");
      res.end('401 Access Denied');
    }

    return Promise.resolve();
  } catch (e) {
    return Promise.reject(e);
  }
};

exports.default = basicAuthMiddleware;
//# sourceMappingURL=nextjs-basic-auth-middleware.cjs.development.js.map
