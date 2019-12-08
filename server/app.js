// env
require('dotenv').config();
const eraseDatabaseOnSync = false;


const cors = require('cors');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const session = require('express-session')
const exphbs = require('express-handlebars');
const MongoStore = require('connect-mongo')(session);
// mongoose and models
const mongoose = require('mongoose');
const models = require('./models/index');
const seed = require('./models/dbSeed');
console.log(seed);
// routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const itemsRouter = require('./routes/items');
const ridesRouter = require('./routes/rides');
const paymentsRouter = require('./routes/payments');
const chatRouter = require('./routes/chats');
console.log("TESTING")
// mongoose.connect('mongodb://localhost:27017/beem', {useNewUrlParser: true});
//
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   console.log("connected");
//   // we're connected!
// });


var app = express();

app.connectDb = () => {
 return mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true});
};

// view engine setup
//app.set('views', path.join(__dirname, 'views'));

// app.set('view engine', 'ejs');

//use sessions for tracking logins
// change this part
app.use(session({
  secret: 'beemNow',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
}));

//handlebars middlewares
app.engine('handlebars',  exphbs({defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'build')));



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/items', itemsRouter);
app.use('/rides',ridesRouter);
app.use('/payments',paymentsRouter);
app.use('/Cars',chatRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.sendFile(path.join(__dirname, 'build', 'index.html'));

});

//setting up the socket for messaging
var io = require('socket.io')(3002);
var userToSocketId = {}

io.on('connection',socket => {

socket.on('new-user', message =>{
// if(!userToSocketId[message.userName]){   //Commented as overwriting should be  allowed
userToSocketId[message.userName] = socket.id
// }
console.log("userToSocketId:"+message.userName+":"+userToSocketId[message.userName])
})
socket.on('send-chat-message',  message => {

    console.log("message To:"+message.to)

    if(userToSocketId[message.to]){
    console.log("Right place, deliver to : "+userToSocketId[message.to])

    socket.to(userToSocketId[message.to]).emit("client-message",{from:message.from, msg:message.message, time:message.messageTime})
    }
    else{
        console.log("WRONG PLACE!")
    }
});
});

module.exports = app;
