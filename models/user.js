var mongoose= require('mongoose');

//userschema

var userSchema =mongoose.Schema({
    // name:{
    //     type:String,
    //     required:true
    // },
    email:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    admin:{
        type:Number
    }

},{timestamps:true});


var User= mongoose.model('User',userSchema);

module.exports = User;