var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    user_basic: {
        first_name: {
            type: String,
            required: [true, "First Name Required"]
        },
        last_name: {
            type: String,
            required: [true, "Last Name Required"]
        },
        user_name: {
            type: String,
            required: [true, "Last Name Required"]
        },
        profile_image_URL: {
            type: String,
            required: false
        },
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
        street: {
            type: String,
            default: ''
        },
        city: {
            type: String,
            default: ''
        },
        county: {
            type: String,
            default: ''
        },
        pin: {
            type: String,
            default: ''
        },
        isDefault: {
            type: boolean,
            default: false
        },
        geo: {
            lat: { type: number },
            lng: { type: number }
        }
    }],
    created_date: {
        type: Date,
        default: new Date()
    },
    modified_date: {
        type: Date,
        default: new Date()
    },
    recovery: {
        key: {
            type: String,
            default: ''
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
    token: {
        type: String,
        default: ''
    },
    token_expiry: {type: Date},
    registered_IP: {
        type: String,
        default: ''
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    last_login_date: {
        type: String,
        default: ''
    },
    last_login_ip: {
        type: String,
        default: ''
    }
}, { versionKey: false });

module.exports = mongoose.model('users', UserSchema);