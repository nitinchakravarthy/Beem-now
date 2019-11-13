const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const multer = require("multer");
const upload= multer({ dest: 'uploads/' })

// require controllers
const itemController = require('../controllers/itemController');
// router.use(bodyParser.json());

//Nitin code start
router.get('/', function(req, res, next) {
  console.log(req);
  console.log(req.body);
  res.send('items home');
});

// get item size depending upon item ??

router.get('/getPrice',[check('poster','poster id cannot be empty').not().isEmpty(),
                        check('size','Item needs a size').not().isEmpty()],
                      itemController.getPrice);

router.post('/postitem', [check('poster','poster id cannot be empty').not().isEmpty(),
                          check('name','Item name cannot be empty').not().isEmpty(),
                          check('size','Item needs a size').not().isEmpty(),
                          check('price','get the price').not().isEmpty(),
                          check('olat','Item needs on origin location').not().isEmpty(),
                          check('olon','Item needs on origin location').not().isEmpty(),
                          check('dlat','Item needs a destination to be delivered').not().isEmpty(),
                          check('dlon','Item needs a destination to be delivered').not().isEmpty(),
                          check('imageurl','Unable to upload an image').not().isEmpty()],
            itemController.postItem);

//Nitin code end

// Get Items
router.get('/items', function(req, res){
  Item.getItems(function(err, item){
    if(err){
      throw err;
    }
    console.log(item);
    res.json(item);
  });
});

// Get Items by Item ID
router.get('/items/:_id', function(req, res){
  Item.getItemsById(req.params._id, function(err, item){
    if(err){
      throw err;
    }
    console.log(item);
    res.json(item);
  });
});

// Search Items by poster Username (query) - can adapt to UID
router.get('/poster/search', function(req, res){
  Item.getUserItems(req.query.poster, function(err, item){
    if(err){
      throw err;
    }
    console.log(item);
    console.log(req.query.poster);
    res.json(item);
  });
});

// Search Items by driver username - can adapt to UID
router.get('/driver/search', function(req, res){
  Item.getDriverItems(req.query.pickedupBy, function(err, item){
    if(err){
      throw err;
    }
    console.log(item);
    console.log(req.query.pickedupBy);
    res.json(item);
  });
});

// Search Items for Specific Size (small, medium, large)
router.get('/size/search', function(req, res){
  Item.getItemsBySize(req.query.size, function(err, item){
    if(err){
      throw err;
    }
    console.log(item);
    console.log(req.query.size);
    res.json(item);
  });
});

// Post an Item
router.post('/items', function(req, res){
  var item = req.body;
  Item.addItem(item, function(err, item){
    if(err){
      throw err;
    }
    console.log(item);
    res.json(item);
  });
});

// Update Item by ID
router.put('/items/:_id', function(req, res){
  var id = req.params._id;
  var item = req.body;
  Item.updateItem(id, item, {}, function(err, item){
    if(err){
      throw err;
    }
    console.log(item);
    res.json(item);
  });
});

// Delete Item by id
router.delete('/items/:_id', function(req, res){
  Item.deleteItem(req.params._id, function(err, item){
    if(err){
      throw err;
    }
    console.log('deleted')
    console.log(item);
    res.json(item);
  })
})

// Update Pickup Info of items
router.put('/items/pickup/:_id', function(req, res){
  var id = req.params._id;
  var item = req.body;
  Item.updateItemPickup(id, item, {}, function(err, item){
    if(err){
      throw err;
    }
    console.log('pickup update');
    console.log(item);
    res.json(item);
  });
});

// Update Delivery of Items
router.put('/items/status/:_id', function(req, res){
  var id = req.params._id;
  var item = req.body;
  Item.updateItemDelivery(id, item, {}, function(err, item){
    if(err){
      throw err;
    }
    console.log('delivery status update');
    console.log(item);
    res.json(item);
  });
});

module.exports = router;
