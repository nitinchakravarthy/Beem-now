const path = require('path');
const User = require('../models/user');
const Token = require('../models/token');
const {check, validationResult} = require('express-validator');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
// const sgTransport = require('nodemailer-sendgrid-transport');
const multer = require("multer");
const fs = require("fs");
const upload= multer({ dest: 'uploads/' })
var transporter = nodemailer.createTransport({ service: 'Sendgrid',
                                                auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD } });

// limits: {fileSize: 4 * 1024 * 1024}

//error_code 0- success
// 1 - error (display message) - type: for error type
// type: 0 - email is not associated with any Account
// 1- email associated with another account
// 2 - invalid credentials
// 3 - email not verified
// 4 all others - check error message (directly show error message)

exports.loginHandler = function(req, res, next) {
  // Check for validation erro
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) return res.status(422).jsonp(errors.array());

  console.log(req.body)
  //var top_user = null;
  User.findOne({ email: req.body.email }, function( err,user){
    if (!user) return res.status(401).send({error_code:1 , type:0, msg: 'The email address ' + req.body.email + ' is not associated with any account.'});
    //console.log(req.body.password);
    //console.log(user);
    user.comparePassword(req.body.password, function(err, isMatch){
        if (err) return res.status(500).send({ error_code:1, type:4 , msg: err.message });
        if (!isMatch) return res.status(401).send({ error_code:1, type: 2 ,msg: 'Invalid email or password' });
        if (!user.verified) return res.status(401).send({error_code:1,  type: 3 , msg: 'Your account has not been verified.' });

        const result = user.toJSON();
        delete result.password;
        res.send( {error_code :0, user: result})
    });
  });
};

exports.signUpHandler = function (req,res,next){
  // Check for validation errors
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) return res.status(422).jsonp(errors.array());
  console.log("in signup request, no validation errors");
  console.log(req.body);
  // Making sure the account doesn't already exist
  User.findOne({email:req.body.email}, function(err,user){
    // Make sure user doesn't already exist
    if (user) return res.status(400).send({error_code:1, type:1, msg: 'The email address you have entered is already associated with another account.' });

    // Create and save the user
    user = new User({ first_name: req.body.first_name, last_name : req.body.last_name, email: req.body.email, password: req.body.password, gender: req.body.gender });
    user.save(function(err){
      if (err) { return res.status(500).send({error_code:1,type:4, msg: err.message }); }

      // Create a verification token for this user
      var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

      // Save the verification token
      token.save(function(err){
        if (err) { return res.status(500).send({error_code:1,type:4, msg: err.message }); }

        // sending a verification email
        // Change the service
        const mailOptions = { from: process.env.SENDGRID_EMAIL, to: user.email, subject: 'New Account Verification',
                          text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/users\/confirmation\/?token=' + token.token + '.\n' };
        console.log(mailOptions);
        // sgMail.send(mailOptions);
        transporter.sendMail(mailOptions, function (err) {
                if (err) { console.log(err);return res.status(500).send({ msg: err.message }); }
                console.log("Mail sent");
                const resp = {'verified': false, 'mailSent': true, 'email': user.email};
                res.status(200).send(resp);
        });
      });
    });
  });
};

exports.confirmationPost = function(req,res,next){
  // Check for validation erro
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) return res.status(422).jsonp(errors.array());

  const token = req.query.token;
  console.log(token);
  // Find a matching token
  Token.findOne({token : req.query.token}, function(err, token){
    if(!token) res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' });

    // If we found a token, find a matching user
    User.findOne({_id: token._userId}, function(err,user){
      if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
      if (user.verified) return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });

      // Verify and save the user
      user.verified = true;
      user.save(function(err){
        if (err)  { return res.status(500).send({ msg: err.message }); }
        res.status(200).send("The account has been verified. Please log in.");
      });
    });
  });
};

exports.resendToken = function(req,res,next){
  // Check for validation erro
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) return res.status(422).jsonp(errors.array());

  User.findOne({email: req.body.email}, function(err,user){
    if (!user) return res.status(400).send({ msg: 'We were unable to find a user with that email.' });
    if (user.verified) return res.status(400).send({ msg: 'This account has already been verified. Please log in.' });

    // Create a verification token, save it, and send email
    var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

    // Save the token
    token.save(function (err) {
        if (err) { return res.status(500).send({ msg: err.message }); }
        // Send the email
        var transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD } });
        var mailOptions = { from: process.env.SENDGRID_EMAIL, to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/users\/confirmation\/?token=' + token.token + '.\n' };
        transporter.sendMail(mailOptions, function (err) {
            if (err) { return res.status(500).send({ msg: err.message }); }
            res.status(200).send('A verification email has been sent to ' + user.email + '.');
        });
    });
  });
};

exports.sendProfile = function (req, res, next) {
  // Check for validation erro
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) return res.status(422).jsonp(errors.array());

  User.findOne({_id:req.body.uid}, function(err,user){
    if (err) return res.status(500).send({ msg: err.message });
    if (!user) return res.status(400).send({ msg: 'We were unable to find your profile information' });
    if (!user.verified) return res.status(400).send({ msg: 'This account has not been verified. Please verifiy your account' });

    // need to fix this
    const result = user.toJSON();
    delete result.password;
    res.send( {user: result})
  });
}

exports.resetPasswordStart = function(req,res,next){
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) return res.status(422).jsonp(errors.array());

  User.findOne({email: req.body.email}, function(err,user){
    if(err) return res.status(500).send({ msg: err.message });
    if (!user) return res.status(400).send({ msg: 'No account found with this email id.' });
    if (!user.verified) return res.status(400).send({ msg: 'This account has not been verified. Please verifiy your account' });

    // Create a verification token, save it, and send email, once the email is open there is an option to change password
    var token = new Token({ _userId: user._id, token: crypto.randomBytes(20).toString('hex') });
    token.save(function (err) {
        if (err) { return res.status(500).send({ msg: err.message }); }
        // Send the email
        var transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD } });
        var mailOptions = { from: process.env.SENDGRID_EMAIL, to: user.email, subject: 'Password Reset', text: 'Hello,\n\n' + 'Please click on the link below to reset your password: \nhttp:\/\/' + req.headers.host + '\/users\/setNewPassword\/?token=' + token.token + '.\n' };
        transporter.sendMail(mailOptions, function (err) {
            if (err) { return res.status(500).send({ msg: err.message }); }
            res.status(200).send('A verification email has been sent to ' + user.email + '.');
        });
    });

  });
};

exports.SendPasswordResetPage = function(req,res,next){
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) return res.status(422).jsonp(errors.array());

  const token = req.query.token;
  console.log(token);
  // Find a matching token
  Token.findOne({token : req.query.token}, function(err, token){
    if(!token) res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' });

    // If we found a token, find a matching user
    User.findOne({_id: token._userId}, function(err,user){
      if (err) { return res.status(500).send({ msg: err.message }); }
      if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
      if (!user.verified) return res.status(400).send({ type: 'Not-verified', msg: 'This user is not verified.' });

      // send the password reset page
      res.sendFile(path.join(path.resolve(__dirname, '..'), 'public','setNewPassword.html'));
      //console.log("before render");
      //res.render("http://http://192.168.0.5:3000/resetPassword");
    });
  });
};

exports.resetPasswordEnd = function(req,res,next){
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) return res.status(422).jsonp(errors.array());

  if(req.body.newPassword === req.body.newPasswordConf){
    Token.findOne({token : req.body.token}, function(err, token){
      if(!token) res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' });

      // If we found a token, find a matching user
      User.findOne({_id: token._userId}, function(err,user){
        if (err) { return res.status(500).send({ msg: err.message }); }
        if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
        if (!user.verified) return res.status(400).send({ type: 'Not-verified', msg: 'This user is not verified.' });
        console.log(req.body.currentPassword);
        console.log(user);
          user.password = req.body.newPassword;
          user.save(function(err){
            if (err)  { return res.status(500).send({ msg: err.message }); }
            res.status(200).send("Password updated");
          });
      });
    });
  }

  // methods to update fields and update profile image and stuff

}

exports.uploadAvatar = async function(req,res,next){
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) return res.status(422).jsonp(errors.array());

  await console.log('upload avatar');
  console.log(req.file);
  console.log(req.body);
  console.log(req.body.uid);

  if (!req.file) {
    res.status(401).json({error: 'Please provide an image'});
  }
  const imagePath = path.join(path.resolve(__dirname, '..'), '/public/images');
  const fileUpload = new Resize(imagePath);
  const filename = await fileUpload.save(req.file.buffer);
  // insert the filename into mongoDB user
  User.findOne({_id: req.body.uid}, function(err,user){
    if (err) { return res.status(500).send({ msg: err.message }); }
    if (!user) return res.status(400).send({ msg: 'We were unable to find a user.' });
    if (!user.verified) return res.status(400).send({ type: 'Not-verified', msg: 'This user is not verified.' });
    user.avatar = filename;
    user.save(function(err){
        if (err)  { return res.status(500).send({ msg: err.message }); }
        return res.status(200).json({ name: filename });
      });
  });
  return res.status(500).send({ msg: 'Unable to upload image, Please upload again' })
}

exports.getAvatarImage = function(req,res,next){
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) return res.status(422).jsonp(errors.array());

  console.log(req.body.uid);
  User.findOne({_id:req.body.uid}, function(err,user){
    if (err)  { return res.status(500).send({ msg: err.message }); }
    if (!user) return res.status(400).send({ msg: 'We were unable to find a user.' });
    if (!user.verified) return res.status(400).send({ type: 'Not-verified', msg: 'This user is not verified.' });

    fileName = user.avatar;
    const imagePath = path.join(path.resolve(__dirname, '..'), '/public/images',fileName);
    var s = fs.createReadStream(file);
    s.on('open',function(){
      res.set('Content-Type', type);
        s.pipe(res);
    });
    s.on('error', function () {
        res.set('Content-Type', 'text/plain');
        res.status(404).end('Not found');
    });

  });

}

exports.editProfile = function(req,res,next){
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) return res.status(422).jsonp(errors.array());
  console.log(req.body.uid);
  User.findOne({_id:req.body.uid}, function(err,user){
    if (err)  { return res.status(500).send({ msg: err.message }); }
    if (!user) return res.status(400).send({ msg: 'We were unable to find a user.' });
    if (!user.verified) return res.status(400).send({ type: 'Not-verified', msg: 'This user is not verified.' });

    // change the item according to the body of the request
    if(req.body.batch){ user.batch = req.body.batch; };
    if(req.body.university) { user.university = req.body.university; };
    if(req.body.major) { user.major = req.body.major; };
    if(req.body.contactNumber) { user.major = req.body.contactNumber; };

    user.save(function(err){
        if (err)  { return res.status(500).send({ msg: err.message }); }
        const user = user.toJSON();
        delete user.password;
        return res.send( {user: user})
      });
  });
}

exports.logout = function(req,res,next){
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) return res.status(422).jsonp(errors.array());

};
