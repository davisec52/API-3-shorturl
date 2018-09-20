//"use strict";
const crypto = require("crypto");
const hashID = require("hashids");

//"use strict";
let saltId = function(){
    let token = crypto.randomBytes(64).toString('hex');
    return token;
};

//"use strict";
let secretNums = function(){
    return Math.round(Math.random() * 1000);
};

//module.exports = helperObj;

module.exports = {
    saltId,
    secretNums
};