import express from 'express';
import ServicesRequest from '../models/serviceRq';
import Services from '../models/services'
import Users from '../models/users'

import Q from 'q';
var router = express.Router();

// middleware that is specific to this router
router.use((req, res, next) => {
    //console.log('/Accounts  : :  ', req.body);
    next();
});

router.get('/dashcount', function (req, res) {


    var countResponseToSend = {
        users: 0,
        servicesrq: 0,
        services: 0,

    }

    getServicesRequestCount()
        .then((servicesRequestCount) => getUsersCount())
        .then((userCount) => getservicesCount())
        .then(function name(params) {
            res.send(countResponseToSend);
        });


    function getServicesRequestCount() {

        var defered = Q.defer();
        new ServicesRequest().allRequestEver((err, servicesrq) => {
            countResponseToSend.servicesrq = servicesrq.length.toString();
            defered.resolve(servicesrq.length.toString());
        });
        return defered.promise;
    }
    function getUsersCount() {
        var defered = Q.defer();
        new Users().allUsers((err, users) => {
            countResponseToSend.users = users.length.toString();
            defered.resolve(users.length.toString());
        });
        return defered.promise;
    }
    function getservicesCount() {
        var defered = Q.defer();
        new Services().allServices((err, services) => {
            countResponseToSend.services = services.length.toString()
            defered.resolve(services.length.toString());
        });
        return defered.promise;
    }
});



module.exports = router;