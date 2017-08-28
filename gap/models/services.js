'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _serviceModel = require('../schemas/serviceModel');

var _serviceModel2 = _interopRequireDefault(_serviceModel);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ObjID = _mongoose2.default.Types.ObjectId;

var notRequiredInService = { "modifiedDate": 0, "isActive": 0 };

var Service = function () {
  function Service() {
    _classCallCheck(this, Service);
  }

  _createClass(Service, [{
    key: 'saveServices',
    value: function saveServices(service, cb) {
      _serviceModel2.default.save(service, function (err, service) {
        cb(err, service);
      });
    }
  }, {
    key: 'allServices',
    value: function allServices(cb) {
      _serviceModel2.default.find({ "isActive": true }, notRequiredInService, function (err, services) {
        cb(err, services);
      });
    }
  }, {
    key: 'findServiceById',
    value: function findServiceById(_id, cb) {
      _serviceModel2.default.findOne({ "_id": new ObjID(_id), "isActive": true }, notRequiredInService, function (err, service) {
        cb(err, service);
      });
    }
  }, {
    key: 'addNew',
    value: function addNew(name, title, type, desc, rate, createdBy, isActive, cb) {
      var newService = new _serviceModel2.default({
        name: name,
        title: title,
        type: type,
        desc: desc,
        rate: rate,
        createdBy: createdBy,
        isActive: isActive
      });
      newService.save(function (err, service) {
        cb(err, service);
      });
    }
  }, {
    key: 'updateServiceById',
    value: function updateServiceById(_id, newService, cb) {
      _serviceModel2.default.findOne({ "_id": new ObjID(_id) }, function (err, service) {
        if (err) {
          cb(err, service);
        } else if (service != null) {
          service.title = newService.title != undefined ? newService.title : service.title;
          service.type = newService.type != undefined ? newService.type : service.type;
          service.rate = newService.rate != undefined ? newService.rate : service.rate;
          service.name = newService.name != undefined ? newService.name : service.name;
          service.createdBy = newService.createdBy != undefined ? newService.createdBy : service.createdBy;
          service.isActive = newService.isActive != undefined ? newService.isActive : service.isActive;
          service.modifiedDate = new Date();
          service.save(function (e, v) {
            cb(e, v);
          });
        } else {
          cb({ "msg": "No Service matches ID" }, null);
        }
      });
    }
  }, {
    key: 'changeServiceStatus',
    value: function changeServiceStatus(_id, status, cb) {
      _serviceModel2.default.findOne({ "_id": new ObjID(_id) }, function (err, service) {
        if (err) {
          cb(err, service);
        } else if (service == null) {
          cb({ "msg": "No Service matches ID" }, null);
        } else {
          service.isActive = status;
          service.save(function (e, v) {
            cb(e, v);
          });
        }
      });
    }
  }]);

  return Service;
}();

exports.default = Service;