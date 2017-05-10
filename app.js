const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const validUrl = require("valid-url");
const app = express();
const indexRoutes = require("./routes/index");

//mongoose.connect("mongodb://shorturluser:shorturlpw@ds133271.mlab.com:33271/shorturlapi");
mongoose.connect(process.env.DBURI);
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

let checkUrl = function(req, res, next){
    if(validUrl.isHttpUri(req.body.urlToShorten) || validUrl.isHttpsUri(req.body.urlToShorten) || req.body.urlToShorten === undefined){
        next();
    }else{
        res.status(500).json({error: "Not a valid url. Url does not meet valid url format requirements."});
    }
};

app.use(checkUrl);

app.use("/", indexRoutes);

app.listen(process.env.PORT, process.env.IP, () => {
	console.log("Short url server listening...");
});
