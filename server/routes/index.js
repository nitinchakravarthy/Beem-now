var express = require('express');
var router = express.Router();
var Name = require('../models/name');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// database test insert
router.post('/postName', function(req, res, next) {
  console.log(req);
  console.log(req.body);

  var r1 = new Name(req.body);
  console.log(r1);
  r1.save().then(item => {
     res.send("item saved to database");
     })
     .catch(err => {
       res.status(400).send("unable to save to database");
    });
});


module.exports = router;
