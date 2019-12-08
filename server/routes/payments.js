const express = require('express');
const router = express.Router();
const Name = require('../models/name');
const {check, validationResult} = require('express-validator');


const stripeController = require('../controllers/stripeController');
/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(req);
    console.log(req.body);
    res.send('payments home');
});

// insert uid check
router.get('/connectToStripe', stripeController.sendConnectStripePage);

// http://localhost:3001/payments/stripeConnected?scope=read_write&code=ac_G9H5LcR9u4Ydb3LFhdDcqNKfhhUlKOke
router.get('/ConnectedToStripe',[check("code").not().isEmpty()],
            stripeController.authorize);


router.get('createCharge',[],stripeController.createCharge);

module.exports = router;
