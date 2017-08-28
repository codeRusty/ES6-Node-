'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _serviceRequestModel = require('../schemas/serviceRequestModel');

var _serviceRequestModel2 = _interopRequireDefault(_serviceRequestModel);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ObjID = _mongoose2.default.Types.ObjectId;

var notRequiredInService = { "modifiedDate": 0, "isActive": 0 };

var ServicesRequest = function () {
    function ServicesRequest() {
        _classCallCheck(this, ServicesRequest);
    }

    _createClass(ServicesRequest, [{
        key: 'saveServicesRequest',
        value: function saveServicesRequest(service, cb) {
            _serviceRequestModel2.default.save(service, function (err, service) {
                cb(err, service);
            });
        }
    }, {
        key: 'allRequestEver',
        value: function allRequestEver(cb) {
            _serviceRequestModel2.default.find({}, notRequiredInService, function (err, services) {
                cb(err, services);
            });
        }
    }, {
        key: 'allActiveServicesRequest',
        value: function allActiveServicesRequest(cb) {
            _serviceRequestModel2.default.find({ "isActive": true }, notRequiredInService, function (err, services) {
                cb(err, services);
            });
        }
    }, {
        key: 'allCanceledServicesRequest',
        value: function allCanceledServicesRequest(cb) {
            _serviceRequestModel2.default.find({ "isCanceled": true }, notRequiredInService, function (err, services) {
                cb(err, services);
            });
        }
    }, {
        key: 'allCompletedServicesRequest',
        value: function allCompletedServicesRequest(cb) {
            _serviceRequestModel2.default.find({ "isCanceled": true }, notRequiredInService, function (err, services) {
                cb(err, services);
            });
        }
    }, {
        key: 'findServiceRequestById',
        value: function findServiceRequestById(_id, userId, cb) {
            _serviceRequestModel2.default.findOne({ "_id": new ObjID(_id), requestedBy: userId, "isActive": true }, notRequiredInService, function (err, service) {
                cb(err, service);
            });
        }
    }, {
        key: 'addNewServiceRequest',
        value: function addNewServiceRequest(serviceRequested, userRequested, address, payMode, cb) {
            _serviceRequestModel2.default.find({ serviceID: serviceRequested._id, requestedBy: userRequested._id, isCompleted: false }, function (error, service) {
                if (error) cb(error, null);else if (service.length == 0) {
                    var newServiceRequest = new _serviceRequestModel2.default({
                        serviceID: serviceRequested._id,
                        serviceName: serviceRequested.name,
                        userName: userRequested.firstName + ' ' + userRequested.lastName,
                        serviceTitle: serviceRequested.title,
                        serviceType: serviceRequested.type,
                        serviceRate: serviceRequested.rate,
                        requestedBy: userRequested._id,
                        address: address,
                        isPaymentDone: 1,
                        status: "Initiated",
                        isActive: true,
                        isCanceled: false,
                        isCompleted: false
                    });
                    newServiceRequest.save(function (err, serviceRq) {
                        cb(err, serviceRq);
                    });
                } else {
                    cb({ message: "inprocess" }, null);
                }
            });
        }
    }, {
        key: 'updateServiceRequestById',
        value: function updateServiceRequestById(_id, newService, cb) {
            _serviceRequestModel2.default.findOne({ "_id": new ObjID(_id) }, function (err, service) {
                if (err) {
                    cb(err, service);
                } else if (service != null) {
                    service.serviceName = newService.title != undefined ? newService.title : service.serviceName;
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
        key: 'changeServiceRequestStatus',
        value: function changeServiceRequestStatus(_id, status, cb) {
            _serviceRequestModel2.default.findOne({ "_id": new ObjID(_id) }, function (err, service) {
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

    return ServicesRequest;
}();

exports.default = ServicesRequest;