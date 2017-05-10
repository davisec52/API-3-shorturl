const mongoose = require("mongoose");

let UrlSchema = new mongoose.Schema({
    count: Number,
    secretNums: Number,
    saltToken: String,
    longUrl: String,
    shortCode: String
});

module.exports = mongoose.model("Url", UrlSchema);