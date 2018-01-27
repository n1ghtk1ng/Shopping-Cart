/**
 * Created by aman on 27/6/17.
 */
var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var schema=new Schema({
   user:{type:Schema.Types.ObjectId,ref:'User'}, //it will hold an id refering to the user object we created in user.js model (we do this by refering to the user model)
    cart:{type:Object,required:true},
    address:{type:String,required:true},
    name:{type:String,required:true},
    paymentId:{type:String,required:true}  //payment id is available in stripe account
});
//we work with models which are made based on the schema i.e. the blueprints
module.exports=mongoose.model('Order',schema);