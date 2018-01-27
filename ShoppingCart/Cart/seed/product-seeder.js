/**
 * Created by aman on 23/6/17.
 */

var Product=require('../models/product');
var mongoose=require('mongoose');
mongoose.connect('localhost:27017/shopping');

var products=[
    new Product({
        imagePath:'https://cdn.playbuzz.com/cdn/e516908f-52f4-42ac-9743-c9d1d95eb0cb/15b59748-921e-4953-8d28-6d0054fd3ffa.jpg',
        title:'FIFA 18',
        description:'FIFA 18 is an upcoming football simulation video game in the FIFA series developed and published by Electronic Arts',
        price:20
    }),
    new Product({
        imagePath:'http://www.ablogtowatch.com/wp-content/uploads/2009/10/tissot-v8-quartz-chronograph-2009-watch.jpg',
        title:'Watch',
        description:'A Brand New Watch Collection',
        price:40
    }),
    new Product({
        imagePath:'http://imshopping.rediff.com/imgshop/800-1280/shopping/pixs/17807/f/fighter_1._port-fighter-football-sports-shoes-studs.jpg',
        title:'Shoes',
        description:'Shoes for Sportsmen',
        price:100
    }),
    new Product({
        imagePath:'http://static3.businessinsider.com/image/574352c952bcd0210c8c48ae-1500-1125/eat-sleep-code-tshirt.jpg',
        title:'Tshirt',
        description:'A Tshirt for the developers',
        price:40
    })
];
var done=0;
for(var i=0;i<products.length;i++){
    products[i].save(function (err,result) {
        done++;
        if(done===products.length)
            exit();
        
    });
}

function exit() {
    mongoose.disconnect();
}