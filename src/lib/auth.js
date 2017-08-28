import jwt from  'jsonwebtoken';
import NResponse from '../helper/newResponse'

var authenticate = function (req, res, next) {
    var token = req.body.token || req.headers.token || req.params.token;
    var userId = req.body.userId || req.params.userId;
    var isUser = false;
    if (typeof (userId) != undefined)
        isUser = true;
    if (token === undefined)
        res.json(new NResponse(false, 200, {
            "success": false,
            "message": "Access Token is mandatory !!"
        }, "Access Token is mandatory !!"));
    else {
        var claim = {};
        try {
            // verify token
            claim = jwt.verify(token, 'JWTSECRETKEY');
            req.claim = claim;
        }
        catch (err) {
            claim = null;
        }
        if (!claim) {
            res.json(new NResponse(false, 200, {
                "success": false,
                "message": "Invalid API Token !!"
            }, "Invalid API Token !!"));
        }
        else {
            next();
        }
    }
}
module.exports = authenticate;