const crypto = require("crypto");
const hashID = require("hashids");

let saltId = function(){
    let token = crypto.randomBytes(64).toString('hex');
    return token;
};

let secretNums = function(){
    return Math.round(Math.random() * 1000);
};

//module.exports = helperObj;

module.exports = {
    saltId,
    secretNums
};