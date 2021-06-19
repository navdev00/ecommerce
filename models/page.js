var mongoose =require('mongoose');

// page schema

var pageSchema = mongoose.Schema({
   
    title: {
        type: String,
        required: true
    },

    slug:{
           type:String
    },

    content:{

        type: String,
        required:true
    }


});

var Page = mongoose.model('Page',pageSchema)

module.exports= Page ;