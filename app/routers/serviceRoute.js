'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _services = require('../models/services');

var _services2 = _interopRequireDefault(_services);

var _newResponse = require('../helper/newResponse');

var _newResponse2 = _interopRequireDefault(_newResponse);

var _commonUtil = require('../helper/commonUtil');

var _commonUtil2 = _interopRequireDefault(_commonUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

// middleware that is specific to this router
router.use(function (req, res, next) {
  console.log('Service Time: ', Date.now());
  next();
});

router.get('/', function (req, res) {
  console.log(req.claim);
  new _services2.default().allServices(function (err, services) {
    if (err == null && services.length > 0) res.json(new _newResponse2.default(true, 200, services, "List of all the Services!!").Objectify());else res.json(new _newResponse2.default(false, 200, null, "No Services Found!!").Objectify());
  });
});

router.get('/:id', function (req, res) {
  if (new _commonUtil2.default().IsMongoObjectID(req.params.id)) {
    new _services2.default().findServiceById(req.params.id, function (err, service) {
      if (service == null || err != null) {
        res.json(new _newResponse2.default(false, 200, null, "No Services Found!!").Objectify());
      } else {
        res.json(new _newResponse2.default(true, 200, service, "Service Found").Objectify());
      }
    });
  } else {
    res.json(new _newResponse2.default(false, 200, null, "Invalid Service Id").Objectify());
  }
});

router.post('/', function (req, res) {
  var name = req.body.name === undefined ? "" : req.body.name;
  var title = req.body.title === undefined ? "" : req.body.title;
  var type = req.body.type === undefined ? "" : req.body.type;
  var desc = req.body.desc === undefined ? "" : req.body.desc;
  var rate = req.body.rate === undefined ? "" : req.body.rate;
  var createdBy = req.body.createdBy === undefined ? "" : req.body.createdBy;

  new _services2.default().addNew(name, title, type, desc, rate, createdBy, true, function (err, service) {
    if (err) res.json(new _newResponse2.default(false, 200, err.message, "Unable to add Service").Objectify());else res.json(new _newResponse2.default(true, 200, { "_id": service._id }, "Service added succesfully!!").Objectify());
  });
});

router.put('/:id', function (req, res) {
  if (new _commonUtil2.default().IsMongoObjectID(req.params.id)) {
    new _services2.default().updateServiceById(req.params.id, req.body, function (err, service) {
      if (err) {
        res.json(new _newResponse2.default(false, 200, null, "No Services Found!!").Objectify());
      } else {
        res.json(new _newResponse2.default(true, 200, service, "Service Updated!!").Objectify());
      }
    });
  } else {
    res.json(new _newResponse2.default(false, 200, null, "Bad Request").Objectify());
  }
});

router.delete('/:id', function (req, res) {
  if (new _commonUtil2.default().IsMongoObjectID(req.params.id)) {
    new _services2.default().changeServiceStatus(req.params.id, false, function (err, service) {
      if (err) {
        res.json(new _newResponse2.default(false, 200, null, "Error in deleting Service").Objectify());
      } else {
        res.json(new _newResponse2.default(true, 200, { "_id": service._id }, "Service Removed!!").Objectify());
      }
    });
  } else {
    res.json(new _newResponse2.default(false, 200, null, "Bad Request").Objectify());
  }
});

/// al service done

router.post('/:id/by/:uid', function (req, res) {
  var serviceId = req.body.serviceID === undefined ? "" : req.body.serviceID;
  var serviceName = req.body.serviceName === undefined ? "" : req.body.serviceName;
  var serviceCat = req.body.serviceCat === undefined ? "" : req.body.serviceCat;
  var userId = req.body.userId === undefined ? "" : req.body.userId;
  var userName = req.body.userId === undefined ? "" : req.body.userName;
  var paymentMode = req.body.paymentMode === undefined ? "" : req.body.paymentMode;

  var commonUtil = new _commonUtil2.default();

  if (commonUtil.IsMongoObjectID(serviceId) && commonUtil.IsMongoObjectID(userId)) {} else {
    res.json(new _newResponse2.default(false, 200, null, "Bad Request").Objectify());
  }
});

module.exports = router;