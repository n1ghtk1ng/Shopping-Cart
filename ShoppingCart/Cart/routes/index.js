var express = require('express');
var router = express.Router();
var Product=require('../models/product');
var Cart=require('../models/cart');
var Order=require('../models/order');
/* GET home page. */

router.get('/', function(req, res, next) {
    var successMsg=req.flash('success')[0];  // the success field is set when the passport payment is successful
  //var products=Product.find();  dont do like this as this is asynchronous
    Product.find(function (err,docs) {
        var productChunks=[];
        var chunkSize=3;

        for(var i=0;i<docs.length;i+=chunkSize){
            productChunks.push(docs.slice(i,i+chunkSize));
        }
        res.render('shop/index', { title: 'Shopping Cart',products:productChunks,successMsg:successMsg,noMessage:!successMsg });
    });

});

router.get('/add-to-cart/:id',function (req,res,next) {
   var productId=req.params.id;
   var cart=new Cart(req.session.cart?req.session.cart:{} );
   Product.findById(productId,function (err,product) {
       if(err)
           return res.redirect('/');
       cart.add(product,product.id);

       req.session.cart=cart; //after this express session is automatically saved as soon as response is sent
       //console.log(req.session.cart);
       res.redirect('/');
   })

});

router.get('/reduce/:id',function (req,res,next) {
   var productId=req.params.id;
    var cart=new Cart(req.session.cart?req.session.cart:{} );
    cart.reduceByOne(productId);
    req.session.cart=cart;
    res.redirect('/shopping-cart');
});
router.get('/remove/:id',function (req,res,next) {
    var productId=req.params.id;
    var cart=new Cart(req.session.cart?req.session.cart:{} );
    cart.removeItem(productId);
    req.session.cart=cart;
    res.redirect('/shopping-cart');
});
router.get('/shopping-cart',function (req,res,next) {
    if(!req.session.cart){
        return res.render('shop/shopping-cart',{products:null});
    }
    var cart= new Cart(req.session.cart);
    res.render('shop/shopping-cart',{products:cart.generateArray(),totalPrice:cart.totalPrice});
});

router.get('/checkout',isLoggedIn,function (req,res,next) {
    //first check whether user has something in the cart or not ,, if not there is no point in payment stuff
    if(!req.session.cart){
        return res.redirect('/shopping-cart');
    }
    var cart= new Cart(req.session.cart); //grab ur shopping-cart
    var errMsg=req.flash('error')[0];   //this errMsg is generated when there is error in /checkout post route and we are redirected back here.
    res.render('shop/checkout',{total:cart.totalPrice,errMsg:errMsg,noError:!errMsg});  //no error is true if there does`nt exist any error
});
router.post('/checkout',isLoggedIn,function (req,res,next) {
    if(!req.session.cart){
        return res.redirect('/shopping-cart');
    }
    var cart= new Cart(req.session.cart);
    var stripe = require("stripe")(
        "sk_test_hj7db0Cpr5CpewlKNjfqlVZp"    //this is the secret key that is not accessible to everyone
    );

    stripe.charges.create({
        amount: cart.totalPrice*100,   //*100 is done as this amount is in cents
        currency: "usd",
        source: req.body.stripeToken, // obtained with Stripe.js
        description: "Test Charge"
    }, function(err, charge) {
        // asynchronously called
        if(err){
            req.flash('error',err.message);
            return res.redirect('/checkout')
        }
        var order=new Order({
            user:req.user,   //with the help of passport
            cart:cart,
            address:req.body.address,
            name:req.body.name,
            paymentId:charge.id
        });
        order.save(function (err,result) {
            //here there is need to handle error yourself

            req.flash('success','Successfully Bought Product');
            req.session.cart=null;  //clear the cart
            res.redirect('/');
        });

    });


});
module.exports = router;


function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    //creating an oldUrl object oursleves(name of ur choice)
    req.session.oldUrl=req.url;

        res.redirect('/user/signin');
}
