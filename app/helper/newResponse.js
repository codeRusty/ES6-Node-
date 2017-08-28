"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NResponses = function () {
    function NResponses(success, statusCode, data, message) {
        _classCallCheck(this, NResponses);

        this.success = success;
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
    }

    _createClass(NResponses, [{
        key: "Objectify",
        value: function Objectify() {
            return {
                "success": this.success,
                "statusCode": this.statusCode,
                "data": this.data,
                "message": this.message
            };
        }
    }]);

    return NResponses;
}();

exports.default = NResponses;