//"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const indexRoutes = require("./routes/index");

//mongoose.Promise = global.Promise;
mongoose.connect(process.env.DBURI);
//mongoose.connect("mongodb://shorturluser:shorturlpw@ds133271.mlab.com:33271/shorturlapi");
//mongoose.connect("mongodb://localhost/shorturl_v1");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

// Many thanks: The code for the regex provided by http://www.w3resource.com/javascript-exercises/javascript-regexp-exercise-9.php. Author unattributed. 
let checkUrl = (req, res, next) => {

  let urlStr = req.body.urlToShorten;
  let regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
        if (regexp.test(urlStr) && urlStr !== "") {
        
          next();
        }
        else
        {
          res.send({error: "Invalid url format."});
          return false;
        }
};
    
app.use("/post", checkUrl);

app.use("/", indexRoutes);

app.listen(process.env.PORT, process.env.IP, () => {
	console.log("Short url server listening...");
});