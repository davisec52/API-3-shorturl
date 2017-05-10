const crypto = require("crypto");
const hashID = require("hashids");
const bodyParser = require("body-parser");
const validUrl = require("valid-url");

let saltId = function(){
    let token = crypto.randomBytes(64).toString('hex');
    return token;
};

let secretNums = function(){
    return Math.round(Math.random() * 1000);
};

/*let decode = function(salt, short){ // @saltToken, @shortCode
    let count = counter > 0 ? counter - 1 : 0;
    let originalHashId = new hashID(shortUrlDb[count][salt]);
    let decodedHash = originalHashId.decode(shortUrlDb[count][short]);
    console.log("decoded hash from within decode: ", decodedHash);
    return decodedHash;
};*/

//module.exports = helperObj;

module.exports = {
    saltId,
    secretNums,
};