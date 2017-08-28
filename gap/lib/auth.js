'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _newResponse = require('../helper/newResponse');

var _newResponse2 = _interopRequireDefault(_newResponse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var authenticate = function authenticate(req, res, next) {
    var token = req.body.token || req.headers.token || req.params.token;
    var userId = req.body.userId || req.params.userId;
    var isUser = false;
    if ((typeof userId === 'undefined' ? 'undefined' : _typeof(userId)) != undefined) isUser = true;
    if (token === undefined) res.json(new _newResponse2.default(false, 200, {
        "success": false,
        "message": "Access Token is mandatory !!"
    }, "Access Token is mandatory !!"));else {
        var claim = {};
        try {
            claim = _jsonwebtoken2.default.verify(token, 'JWTSECRETKEY');
            req.claim = claim;
        } catch (err) {
            claim = null;
        }
        if (!claim) {
            res.json(new _newResponse2.default(false, 200, {
                "success": false,
                "message": "Invalid API Token !!"
            }, "Invalid API Token !!"));
        } else {
            next();
        }
    }
};
module.exports = authenticate;