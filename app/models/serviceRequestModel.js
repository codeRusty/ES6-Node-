'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var serviceRequestSchema = Schema({
    serviceID: {
        type: Schema.ObjectId,
        required: true
    },
    serviceName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    serviceTitle: {
        type: String,
        required: true
    },
    serviceType: {
        type: String,
        required: true
    },
    serviceRate: {
        type: String,
        required: true
    },
    requestedDate: {
        required: true,
        type: Date,
        default: new Date()
    },
    modifiedDate: {
        required: true,
        type: Date,
        default: new Date()
    },
    requestedBy: {
        required: true,
        type: Schema.ObjectId
    },
    status: {
        required: true,
        type: String
    },
    isActive: {
        required: true,
        type: Boolean
    },
    isCanceled: {
        required: true,
        type: Boolean
    },
    isCompleted: {
        required: true,
        type: Boolean
    }
}, { versionKey: false });

module.exports = mongoose.model('service_requests', serviceRequestSchema);