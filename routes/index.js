//"use strict";
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const UrlObj = require("../models");
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
    
    UrlObj.Counter.findById("urlSeq", (err, counterObj) => {
        if(err){
            console.log(err);
        }else{
            UrlObj.Url.findById(counterObj.count, (err, newUrl) => {
                console.log("checking newUrl from show: ", newUrl);
                if(err){
                    console.log(err);
                }else{
                    
                    request.get(newUrl["longUrl"], (err, response, body) => {
                        
                        let urlExist;
                        
                        if(err && err["code"] === "ENOTFOUND"){
                            console.log("testing error: ", err["code"]);
                            urlExist = false;
                        }else if(response === "" && response=== undefined){
                            urlExist = false;
                        }else{
                            urlExist = true;
                        }
                        console.log(urlExist);
                        res.status(200).json({"long url": newUrl["longUrl"], "short url":  process.env.HOST + "/" + newUrl["shortCode"], "url active": urlExist});
                        
                        // For html rendering, uncomment below and comment out res.status above
                        //res.render("final", {"shorturl": newUrl["shortCode"], "host": process.env.HOST});
                    });
                }
                
            });
        }
    });
});

// Get route for shortUrl - handles redirection to original url
router.get("/:shortUrl", (req, res) => {
    
    if(req.params.shortUrl !== "favicon.ico" && req.params.shortUrl){
        
        console.log("calling req params shortUrl: ", req.params.shortUrl);
        
        UrlObj.Url.findOne({shortCode:req.params.shortUrl}, (err, foundObj) => {
            console.log("calling foundObj from get shorUrl #1: ", foundObj);
            if(err){
                
                res.status(500).json({error: "Unable to validate url shortcode."});
                
            }else{
                
              //  console.log("calling foundObj longUrl from get shortUrl #3: ",foundObj["longUrl"]);
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
        secretNums: secretNum,
        saltToken: saltToken,
        longUrl: longUrl,
        shortCode: shortCode
    };
    
    // create mongo db item here
    
    UrlObj.Url.findOne({longUrl: req.body.urlToShorten}, (err, found) => {
        console.log("calling found from post: ", found);
        if(err){
            
            console.log(err);
            
        }else if(found){
            
            console.log("url already exists in db.");
            
            res.status(200).json({"longUrl": found["longUrl"], "short url": process.env.HOST + "/" + found["shortCode"]});
            // For html rendering, uncomment below and comment out res.status above
           // res.render("final", {"shorturl": found["shortCode"], "host": process.env.HOST})
        }else{
            
                    UrlObj.Url.create(newID, (err, newObj) => {
                        
                if(err){
                    
                    res.status(500).json({error: "Error. Unable to create a model for url. " + err});
                    
                }else{
                    console.log("calling newObj from post b4 redirect ", newObj);
                    res.redirect("/show");
                }
            });
        }
    });
});

module.exports = router;