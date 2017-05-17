const mongoose = require("mongoose");


let CounterSchema = new mongoose.Schema({
    _id: {type: String, default: true},
    count: {type: Number, default: 0}
});

let UrlSchema = new mongoose.Schema({
    _id: {type: Number, index: true},
    secretNums: Number,
    saltToken: String,
    longUrl: String,
    shortCode: String
});

UrlSchema.pre("save", function(next){
    var doc = this;
    
    Counter.findByIdAndUpdate({_id: "urlSeq"}, {$inc: {count: 1}}, (err, countItem) => {
        if(err){
            return next(err);
        }else{
            doc._id = countItem.count + 1;
            next();
        }
    });
});

let Counter = mongoose.model("Counter", CounterSchema);
let Url = mongoose.model("Url", UrlSchema);

//module.exports = mongoose.model("Url", UrlSchema);

module.exports = {
    mongoose,
    Counter,
    Url
};