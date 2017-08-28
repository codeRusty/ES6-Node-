'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _serviceRq = require('../models/serviceRq');

var _serviceRq2 = _interopRequireDefault(_serviceRq);

var _services = require('../models/services');

var _services2 = _interopRequireDefault(_services);

var _users = require('../models/users');

var _users2 = _interopRequireDefault(_users);

var _newResponse = require('../helper/newResponse');

var _newResponse2 = _interopRequireDefault(_newResponse);

var _commonUtil = require('../helper/commonUtil');

var _commonUtil2 = _interopRequireDefault(_commonUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

// middleware that is specific to this router
router.use(function (req, res, next) {
  next();
});

router.get('/all', function (req, res) {
  new _serviceRq2.default().allRequestEver(function (err, service) {
    if (service == null || err != null) {
      res.json(new _newResponse2.default(false, 200, null, "No Services Found!!").Objectify());
    } else {
      res.json(new _newResponse2.default(true, 200, service, "Service Found").Objectify());
    }
  });
});

// List All a specific Service Request For all customers
router.get('/:id', function (req, res) {
  if (new CommonUtil().IsMongoObjectID(req.params.id)) {
    new _serviceRq2.default().findServiceRequestById(req.params.id, req.params.userId, function (err, service) {
      if (service == null || err != null) {
        res.json(new _newResponse2.default(false, 200, null, "No Services Found!!").Objectify());
      } else {
        res.json(new _newResponse2.default(true, 200, service, "Service Found").Objectify());
      }
    });
  } else {
    res.json(new _newResponse2.default(false, 200, null, "Bad Request").Objectify());
  }
});

router.get('/:userId/status/:filter', function (req, res) {
  var filter = req.params.filter.toLowerCase();
  var userId = req.params.userId;
  var commonUtil = new _commonUtil2.default();
  if (commonUtil.IsMongoObjectID(userId)) {
    switch (filter) {
      // List All Active the Service Request For all customers (Admin) // can be made for a specific user
      case 'active':
        new _serviceRq2.default().allActiveServicesRequest(function (err, services) {
          if (err == null && services.length > 0) res.json(new _newResponse2.default(true, 200, services, "List of all the Services!!").Objectify());else res.json(new _newResponse2.default(false, 200, null, "No Services Found!!").Objectify());
        });
        break;
      // List All canceled including Inactives the Service Request For all customers (Admin)// can be made for a specific user
      case 'canceled':
        new _serviceRq2.default().allCanceledServicesRequest(function (err, services) {
          if (err == null && services.length > 0) res.json(new _newResponse2.default(true, 200, services, "List of all the Services!!").Objectify());else res.json(new _newResponse2.default(false, 200, null, "No Services Found!!").Objectify());
        });
        break;
      // List All Completed including Inactives Service Request For all customers (Admin)// can be made for a specific user
      case 'completed':
        new _serviceRq2.default().allCompletedServicesRequest(function (err, services) {
          if (err == null && services.length > 0) res.json(new _newResponse2.default(true, 200, services, "List of all the Services!!").Objectify());else res.json(new _newResponse2.default(false, 200, null, "No Services Found!!").Objectify());
        });
        break;
      default:
        res.json(new _newResponse2.default(false, 200, null, "Invalid Request").Objectify());
        break;
    }
  } else {
    res.json(new _newResponse2.default(false, 200, null, "Invalid User ID").Objectify());
  }
});

// Avail a new Service by a customer
router.post('/', function (req, res) {
  var serviceId = req.body.serviceId === undefined ? "" : req.body.serviceId;
  var userId = req.body.userId === undefined ? "" : req.body.userId;
  var address = req.body.address === undefined ? "" : req.body.address;
  var payMode = req.body.paymentMode === undefined ? "" : req.body.paymentMode;

  console.log('payMode', payMode);
  if (serviceId == "" || userId == "") {
    res.json(new _newResponse2.default(false, 200, null, "Bad Request").Objectify());
  } else {
    console.log('else', payMode);
    var commonUtil = new _commonUtil2.default();
    if (commonUtil.IsMongoObjectID(serviceId) && commonUtil.IsMongoObjectID(userId)) {
      console.log('valid', serviceId);
      //validate Service Active and Exists
      new _services2.default().findServiceById(serviceId, function (error, serviceRequested) {
        console.log('error', error);
        if (serviceRequested != null)
          //Validate if User Exist and Active

          new _users2.default().findUserById(userId, function (e, userRequested) {
            if (userRequested != null) {
              new _serviceRq2.default().addNewServiceRequest(serviceRequested, userRequested, address, payMode, function (err, service) {
                if (err != null && err.message == "inprocess") {
                  res.json(new _newResponse2.default(false, 200, err, "You have already requested this service").Objectify());
                } else if (err != null) {
                  res.json(new _newResponse2.default(false, 200, err, "Unable to add Service").Objectify());
                } else {
                  res.json(new _newResponse2.default(true, 200, { "_id": service._id }, "Service added succesfully!!").Objectify());
                }
              });
            } else res.json(new _newResponse2.default(false, 200, null, "Required User Not Found").Objectify());
          });else res.json(new _newResponse2.default(false, 200, null, "Required Service Not Found").Objectify());
      });
    } else {
      res.json(new _newResponse2.default(false, 200, null, "Bad Request").Objectify());
    }
  }
});

// Make Request Inactive
router.delete('/:id', function (req, res) {
  if (new _commonUtil2.default().IsMongoObjectID(req.params.id)) {
    new _serviceRq2.default().changeServiceRequestStatus(req.params.id, false, function (err, service) {
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

// Pending Update
router.put('/:id', function (req, res) {
  if (new _commonUtil2.default().IsMongoObjectID(req.params.id)) {
    new _serviceRq2.default().updateServiceById(req.params.id, req.body, function (err, service) {
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

module.exports = router;