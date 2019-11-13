var mongoose = require('mongoose');

var User = require('./user');
var Ride = require('./ride');
var Item = require('./item');

const models = { User, Ride, Item };

module.exports = models;
