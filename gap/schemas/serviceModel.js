"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var serviceSchema = Schema({
    name: {
        type: String,
        required: [true, "Name Required"]
    },
    title: {
        type: String,
        required: [true, "Title Required"]
    },
    type: {
        type: String,
        required: [true, "Category Type  Required"]
    },
    desc: {
        type: String,
        default: 'N/A'
    },
    rate: {
        type: String,
        default: '0'
    },
    currency: {
        type: String,
        default: 'INR'
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
        type: Boolean,
        default: true
    }
}, { versionKey: false });

module.exports = mongoose.model('services', serviceSchema);