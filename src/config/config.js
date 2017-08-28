const allConfigurations = {};

allConfigurations.db = {
    "mongodb":{
        "host" : "127.0.0.1",
        "port" : "8080"
    }
},

allConfigurations.appSecret = "JWTSECRETKEY";

module.exports = allConfigurations;