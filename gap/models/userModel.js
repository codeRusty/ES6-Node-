"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    firstName: {
        type: String,
        required: [true, "First Name Required"]
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    mobile: {
        type: String
    },
    address: [{
        street: { type: String }, city: { type: String }, county: { type: String }, pin: { type: String }
    }],
    createdDate: {
        type: Date,
        default: new Date()

    },
    modifiedDate: {
        type: Date,
        default: new Date()
    },
    recovery: {
        key: {
            type: String,
            default: ""
        },
        exp: {
            type: Date,
            default: new Date()
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    token: ""
}, { versionKey: false });

module.exports = mongoose.model('users', UserSchema);