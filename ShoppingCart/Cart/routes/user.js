/**
 * Created by aman on 24/6/17.
 */
var express = require('express');
var router = express.Router();
var Product=require('../models/product');
var csrf=require('csurf');
var passport=require('passport');
var Order=require('../models/order');
var Cart=require('../models/cart');

//default configuration of csrf requires session to be enabled
var csrfProtection=csrf();
router.use(csrfProtection);

router.get('/profile',isLoggedIn,function (req,res,next) {
    //here we are ensuring that only logged in users can see there orders
    Order.find({user:req.user},function (err,orders) {
       if(err){
           return res.write('Error!');
       }
       var cart;
       orders.forEach(function (order) {
          // generate cart for each order
           cart=new Cart(order.cart);
           order.items=cart.generateArray();
       });
        res.render('user/profile',{orders:orders});
    });

});
router.get('/logout',isLoggedIn,function (req,res,next) {
    req.logout();
    res.redirect('/');
});

router.use('/',notLoggedIn,function (req,res,next) {
    next();
});

router.get('/signup',function (req,res,next) {
    var messages=req.flash('error');                        //flash package stores the error message in the requests and are stored in the 'error' field if they come from passport
    res.render('user/signup',{csrfToken:req.csrfToken(),messages:messages,hasErrors:messages.length>0})//passing csrf token to our view provided by csurf package
});

// router.post('/user/signup',function (req,res,next) {
//    res.redirect('/');
// });
router.post('/signup',passport.authenticate('local.signup',{//successRedirect:'/user/profile',
    failureRedirect:'/user/signup',
    failureFlash:true}),function (req,res,next) {
    if(req.session.oldUrl){
        var x=req.session.oldUrl;
        req.session.oldUrl=null;
        res.redirect(x);
    }
    else{ // when we are not comin from the checkout process
        res.redirect('/user/profile');
    }
    }
);

router.get('/signin',function (req,res,next) {
    var messages=req.flash('error');                        //flash package stores the error message in the requests and are stored in the 'error' field if they come from passport
    res.render('user/signin',{csrfToken:req.csrfToken(),messages:messages,hasErrors:messages.length>0})//passing csrf token to our view provided by csurf package
});
router.post('/signin',passport.authenticate('local.signin', {//successRedirect:'/user/profile',
    failureRedirect:'/user/signin',
    failureFlash:true
}),function (req,res,next) { // this function will run when there is a success in the login
    if(req.session.oldUrl){
        var x=req.session.oldUrl;
        req.session.oldUrl=null;
        res.redirect(x);
    }
    else{ // when we are not comin from the checkout process
        res.redirect('/user/profile');
    }
});


module.exports = router;


function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    else
        res.redirect('/');
}

function notLoggedIn(req,res,next) {
    if(!req.isAuthenticated()){
        return next();
    }
    else
        res.redirect('/');
}