const express = require('express');
const router = express.Router();


const chats = require('../controllers/chatController');

    // Retrieve all cars
router.get('/cars', chats.findAll);


    // Create a new Car
router.post('/cars', chats.createOrUpdate);

router.get('/cars/:name', chats.findByName);

router.get('/cars/:name/:friendId', chats.findByNameAndFriendName);


module.exports = router;
    // Retrieve a single Car with id
    // router.get('/cars/:noteId', cars.findOne);
