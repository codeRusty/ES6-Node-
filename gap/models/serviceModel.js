'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var serviceSchema = Schema({
    name: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    desc: {
        type: String
    },
    rate: {
        type: String
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
    },
    createdBy: {
        required: true,
        type: String
    },
    isActive: {
        required: true,
        type: Boolean
    }
}, { versionKey: false });

module.exports = mongoose.model('services', serviceSchema);