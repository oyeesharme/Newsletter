// jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.urlencoded({extented:true}));
app.use(express.static("static"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields:{
        FNAME:fname,
        LNAME:lname
      }
    }]
  };

  const jsonData = JSON.stringify(data);

  const listId = process.env.LIST_ID;
  const apiKey = process.env.API_KEY;

  const url = "https://us1.api.mailchimp.com/3.0/lists/" + listId;

  const options = {
    method: "POST",
    auth: "bkunsolved:" + apiKey
  };

  const request = https.request(url, options, function (response) {
    if(response.statusCode!=200){
      res.sendFile(__dirname+"/failure.html");
    }else{
      res.sendFile(__dirname+"/success.html");
    }
  });

  request.write(jsonData);
  request.end();
});

app.post("/backToMain", function (req,res){
  res.redirect("/");
});

app.listen(3000, function () {
  console.log("Server started at port 3000");
});