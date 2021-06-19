var mongoose =require('mongoose');



//product schema

var productSchema = mongoose.Schema({

    title:{
        type:String,
        required:true
    },

    slug:{
        type:String
    },

    desc:{
        type:String,
        required:true
    },

    image:{
        type:String
    },

    price:{
        type:Number

    },

    category:{
        type:String,
        required:true
    }

},{timestamps:true});

 var Product= mongoose.model('Product', productSchema);

 module.exports= Product;
