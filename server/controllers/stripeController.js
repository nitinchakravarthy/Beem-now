const express = require('express');
const path = require('path');
const {check, validationResult} = require('express-validator');
const fs = require("fs");
const stripe = require('stripe')(process.env.STRIPE_TEST_SECRET_KEY);
const request = require('request');
const constants = require('./constants');
const User = require('../models/user');

const router = express.Router();


exports.sendConnectStripePage = function (req,res,next){
  // const errors = validationResult(req);
  // console.log(errors);
  // if (!errors.isEmpty()) return res.status(422).jsonp(errors.array());
  res.render('paymentsIndex');

};

exports.authorize = function (req,res,next){
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) return res.status(422).jsonp(errors.array());

    // make a call to oauth endpoint
    stripe.oauth.token({
        grant_type: 'authorization_code',
        code: req.query.code,
    }).then(function(response) {
      // asynchronously called
      var response = response;  // check if we need something else from here
      if(!response.error){
          //get uid here somehow
          User.findOneAndUpdate({_id:uid}, {stripe_user_id : response.stripe_user_id} ,function(err,user){
              if(err) return res.status(500).send({ msg: err.message });
              if (!user) return res.status(400).send({ msg: 'No account found with this uid.' });
              if (!user.verified) return res.status(400).send({ msg: 'This account has not been verified. Please verifiy your account' });
              // need to do something else ??
              return res.send("stripe id updated");
          });
      }

    });

};

exports.deauthorize = function (req,res,next){
    // will get the uid from the queries
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) return res.status(422).jsonp(errors.array());

    User.findOne({_id:req.query.uid}, function(err,user){
        if(err) return res.status(500).send({ msg: err.message });
        if (!user) return res.status(400).send({ msg: 'No account found with this uid.' });
        if (!user.verified) return res.status(400).send({ msg: 'This account has not been verified. Please verifiy your account' });

        stripe.oauth.deauthorize({
            client_id: constants.stripe_client_id,
            stripe_user_id: user.stripe_user_id,
            }).then(function(response) {
                // asynchronously called
                user.stripe_user_id =undefined;
                user.save(function(err){
                    if (err)  { return res.status(500).send({ msg: err.message }); }
                    res.status(200).send("stripe account unliked");
                });
            });
    })

};

exports.createCharge = function (req,res,next){
    console.log("in create charge")
    stripe.charges.create({
      amount: 1000,
      currency: "usd",
      source: "tok_visa",
      application_fee_amount: 1,
    }, {
      stripe_account: "{{CONNECTED_STRIPE_ACCOUNT_ID}}",
    }).then(function(charge) {
        Console.log("Charge succesfully created");
      // asynchronously called
    });

}

// api to retrieve charges on and from this account
//list of application fees collected

//issue refund
