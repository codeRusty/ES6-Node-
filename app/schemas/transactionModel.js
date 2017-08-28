'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var serviceRequestSchema = Schema({

    serviceRequestId: {
        type: Schema.ObjectId,
        required: true
    },
    paymentMode: {
        type: String,
        required: true
    },
    paymentAmount: {
        type: String,
        required: true
    },
    gatewayUsed: {
        type: String
    },
    IsPaymentDone: {
        required: true,
        type: Number,
        default: 0
    },
    createdDate: {
        required: true,
        type: Date,
        default: new Date()
    },
    modifiedDate: {
        required: true,
        type: Date,
        default: new Date()
    }
}, { versionKey: false });

module.exports = mongoose.model('service_requests', serviceRequestSchema);