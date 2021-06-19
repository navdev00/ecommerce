var mongoose =require('mongoose');

// category schema

var categorySchema = mongoose.Schema({
   
    title: {
        type: String,
        required: true
    },

    slug:{
           type:String
    },


},{timestamps:true});

var Category = mongoose.model('Category',categorySchema)

module.exports= Category ;