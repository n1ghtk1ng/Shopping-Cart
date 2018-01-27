/**
 * Created by aman on 23/6/17.
 */
var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var schema=new Schema({
    imagePath:{type:String,required:true},
    title:{type:String,required:true},
    description:{type:String,required:true},
    price:{type:Number,required:true},

});
//we work with models which are made based on the schema i.e. the blueprints
module.exports=mongoose.model('Product',schema);