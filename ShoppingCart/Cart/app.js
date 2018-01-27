var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expresshbs=require('express-handlebars');
var index = require('./routes/index');
var userRoutes=require('./routes/user');
var mongoose=require('mongoose');
var session=require('express-session');
var app = express();
var passport=require('passport');
var flash=require('connect-flash');
var validator=require('express-validator');

//after session only use connect-mongo-session--store
var MongoStore=require('connect-mongo')(session);

mongoose.connect('localhost:27017/shopping');
require('./config/passport'); // this statement sets up all the strategies required for user login
// view engine setup


app.engine('.hbs',expresshbs({defaultLayout:'layout',extname:'.hbs'}));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator()); //should be done only after body parser
app.use(cookieParser());
app.use(session({
    secret:'keyboardcat',
    resave:false,
    saveUninitialized:false,
        store:new MongoStore({mongooseConnection:mongoose.connection}),  //no new mongoose connection is made ,the one that is used above is only used here
        //here we are using mongostore to store user`s session cart items in the session store, so the user(whether loggedin or not) will have a cookie that identifies a sessionId & his session is stored in mongo sesssion store
    cookie:{maxAge:180*60*1000}
    }
    ));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req,res,next) {
//setting up a global variable which is available in views using locals object on response and add login property to it
    //res.locals is An object that contains response local variables scoped to the request, and therefore available only to the view(s) rendered during that request / response cycle (if any). Otherwise, this property is identical to app.locals.This property is useful for exposing request-level information such as the request path name, authenticated user, user settings, and so on.
    res.locals.login=req.isAuthenticated();
    res.locals.session=req.session; //useed in header.hbs in partials folder for total qty ordered purpose
    //console.log(req.isAuthenticated());
    next();
});
app.use('/user',userRoutes);
app.use('/', index);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
