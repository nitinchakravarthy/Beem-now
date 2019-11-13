const path = require('path');
const User = require('../models/user');
const Token = require('../models/token');
const Item = require('../models/item');

const {check, validationResult} = require('express-validator');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
// const sgTransport = require('nodemailer-sendgrid-transport');
const multer = require("multer");
const fs = require("fs");
const upload= multer({ dest: 'uploads/' })

exports.getPrice = function(req,res,next){

}

exports.postItem =  function(req, res, next) {

  //change this with respect to the object model made
  var item = {
    oid : req.body.oid,
    poster_uid : req.body.poster_uid + ""
  };
  console.log(item);
  var r1 = new Item(item);
  console.log(r1);
  r1.save().then(item => {
    var response = { itemPosted : 1,
                      item_object : item}
     res.send(response);
     })
     .catch(err => {
       var errResp = { itemPosted : 0,
                         item_object : null}
       res.status(400).send(errResp);
    });
}
