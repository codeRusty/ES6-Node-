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
        required: [true, "Last Name Required"]
    },
    email: {
        type: String,
        required: [true, "Email is Required"]
    },
    password: {
        type: String,
        required: [true, "Password is Required"]
    },
    mobile: {
        type: String,
        required: [true, "Mobile Number is Required"]
    },
    role: {
        type: String,
        required: [true, "Role is Required"],
        default: 'user'
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