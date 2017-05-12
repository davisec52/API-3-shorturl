const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const UrlObj = require("../models/index");
const helper = require("../helper/index");
const hashID = require("hashids");
const request = require("request");
const bodyParser = require("body-parser");

// Index Get route
router.get("/", (req, res) => {
	res.render("index");
});

// Show -GET route - display the short url
router.get("/show", (req, res) => {
    
   // console.log("calling HOST from get show route: ", process.env.HOST+"/");
    
    UrlObj.find({}, (err, allObj) => {
        if(err){
            console.log(err);
        }else{
            console.log("total obj in collection: ", allObj);
            
            let identifier = allObj.length-1;
            
        // We check to see if url exists, and add boolean result to final json obj    
            request.get(allObj[identifier]["longUrl"], (error, response, body) => {
               
                let urlExist;
                
                if(response === "" || response === undefined){
                    urlExist = false;
                }else{
                     urlExist = true;
                }
                
            // The challenge specifically asked for an answer rendered in a json format
                res.status(200).json({"long url": allObj[identifier]["longUrl"], "short url": process.env.HOST + "/" +  allObj[identifier]["shortCode"], "urlExist": urlExist});
                
            });
            
            // We can also receive the short url in a nicer html format by commenting out res.status above and
            // uncommenting the line below.
                // res.render("final", {shorturl: allObj[identifier]["shortCode"]});
        }
    });
});

// Get route for shortUrl - handles redirection to original url
router.get("/:shortUrl", (req, res) => {
    
    console.log("calling req params shortUrl: ", req.params.shortUrl);
    
    if(req.params.shortUrl !== "favicon.ico" && req.params.shortUrl){
        
        UrlObj.findOne({shortCode:req.params.shortUrl}, (err, foundObj) => {
            console.log("calling foundObj from get shorUrl #1: ", foundObj);
            if(err){
                
                res.status(500).json({error: "Unable to validate url shortcode."});
                
            }else{
                
                console.log("calling foundObj longUrl from get shortUrl #3: ",foundObj["longUrl"]);
                res.redirect(foundObj["longUrl"]);
            }
        });
    }else{
        
        res.status(500).json({error: "An unidentified issue prevented acquisition of the target. Use back arrow and try again."});
    }
});

// POST route - creates the database url object, gathers the long url, and routes it to /show for rendering
router.post("/post", (req, res) => {
    
    let longUrl = req.body.urlToShorten;
    
    console.log("req.body.urlToShorten: ", longUrl);
    let saltStr = helper.saltId();
    let hashid = new hashID(saltStr);
    let secretNum = helper.secretNums();
    let id = hashid.encode(secretNum);
    let saltToken = hashid.salt;
    let shortCode = id;
    let newID = {
        count: 0,
        secretNums: secretNum,
        saltToken: saltToken,
        longUrl: longUrl,
        shortCode: shortCode
    };
    
    // create mongo db item here
    
    UrlObj.create(newID, (err, newObj) => {
        if(err){
            
            res.status(500).json({error: "Error. Unable to create a model for url."});
            
        }else{
            UrlObj.find({}, (err, allObj) => {
                
                if(err){
                    
                    res.status(500).json({error: "Problem finding url object."});
                    
                }else{
                    
                    let len = allObj.length-1;
                    
                    let counter = allObj.length;
                    console.log("counter: ", allObj.length);
                    
        // Updates count using length as the counter.            
                    UrlObj.findOneAndUpdate({shortCode: allObj[len]["shortCode"]}, {$set: {count: counter}}, (err, doc) => {
                        if(err){
                            
                            res.status(500).json({error: "Cannot find object."});
                            
                        }else{
                            
                            res.redirect("/show");
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;