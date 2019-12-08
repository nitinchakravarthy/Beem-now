const Car = require('../models/message');

// Create and Save a new Chat
exports.createOrUpdate = (req, res) => {
    // Validate request
    // console.log("here comes the request")
    // console.log(req.body)
    if(!req.body) {
        return res.status(400).send({
            message: "Note content can not be empty"
        });
    }


    const SenderName = req.body.name
    const friendName = req.body.friendId
    const msgs = req.body.msgs

    // console.log(SenderName+" "+friendName+" "+msgs.from+" "+msgs.message)
    //TPDP time

    Car.find({name:SenderName, friendId:friendName}).then(
        chat => {

            if(chat[0]){
                console.log("HERE! update chat "+JSON.stringify(msgs))
                chat[0].msgs.push({from:msgs.from,message:msgs.message, time:msgs.time})
                chat[0].save()
                .then(data => {
                    res.send(data);
                    }).catch(err => {
                    res.status(500).send({
                    message: err.message || "Some error occurred while creating the Note."
                    });
                    })
            }
            else{
                const car = new Car({
                    name: SenderName,
                    friendId: friendName,
                    msgs: req.body.msgs,
                    });


                    car.save()
                    .then(data => {
                    res.send(data);
                    }).catch(err => {
                    res.status(500).send({
                    message: err.message || "Some error occurred while creating the Note."
                    });
                    })
            }
        }
    )
    Car.find({name:friendName, friendId:SenderName}).then(
        chat => {
            if(chat[0]){
                // console.log("HERE2!")
                // console.log("HERE! stringify "+JSON.stringify(chat[0]))
                chat[0].msgs.push({from:msgs.from,message:msgs.message, time:msgs.time})
                chat[0].save()
                .then(data => {
                    res.send(data);
                    }).catch(err => {
                    res.status(500).send({
                    message: err.message || "Some error occurred while creating the Note."
                    });
                    })
            }
            else{
                const car = new Car({
                name: friendName,
                friendId: SenderName,
                msgs: req.body.msgs
                });


                car.save()
                .then(data => {
                res.send(data);
                }).catch(err => {
                res.status(500).send({
                message: err.message || "Some error occurred while creating the Note."
                });
                })
        }
        })


//Previous working Create Code start
    // // Create a Note
    // const car = new Car({
    //     name: req.body.name,
    //     friendId: req.body.friendId,
    //     msgs: req.body.msgs,
    //     lastChatDate: req.body.lastChatDate
    // });

    // // Save Note in the database
    // car.save()
    // .then(data => {
    //     res.send(data);
    // }).catch(err => {
    //     res.status(500).send({
    //         message: err.message || "Some error occurred while creating the Note."
    //     });
    // });
    //Previous working Create Code end
    }



exports.findByName = (req, res) => {
    console.log("findByName")


    Car.find({name:req.params.name})
    .then(car => {

        // if(!car) {
        //     return res.status(404).send({
        //         message: "Car not found with id " + req.params.name
        //     });
        // }
        console.log("car = "+car)
        res.send(car);
    }).catch(err => {
        // if(err.kind === 'ObjectId') {
        //     return res.status(404).send({
        //         message: "Car not found with id " + req.params.name
        //     });
        // }
        res.status(500).send({
            message: "Error retrieving car with id " + req.params.name
        });
    });
};

exports.findByNameAndFriendName= (req, res) => {
    // console.log("req params = "+JSON.stringify(req.params))
    Car.find({name:req.params.name, friendId:req.params.friendId})
    .then(car => {
        // if(!car) {
        //     return res.status(404).send({
        //         message: "Car not found with id " + req.params.name
        //     });
        // }
        // console.log("chat found = "+car)
        res.send(car);
    }).catch(err => {
        // if(err.kind === 'ObjectId') {
        //     return res.status(404).send({
        //         message: "Car not found with id " + req.params.name
        //     });
        // }
        res.status(500).send({
            message: "Error retrieving car with id " + req.params.name
        });
    });
};

// Retrieve and return all notes from the database.
exports.findAll = (req, res) => {
    Car.find()
    .then(cars => {
        res.send(cars);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving cars."
        });
    });
};
