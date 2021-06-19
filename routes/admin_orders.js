var express= require('express');
var router=express.Router();
var Order = require('../models/order');
var axios=require('axios');
var moment =require('moment');
var auth =require('../config/auth');
var isAdmin= auth.isAdmin;




router.get('/',isAdmin, function(req,res){
    
    Order.find({status:{ $ne: 'completed'}}, null, {sort: {'createdAt': -1}}).
    populate('customerId', '-password').exec( function(err,orders){
        if(err){
            console.log(err);
        }else{
            res.render('admin/orders',{
                orders:orders,
                moment:moment
            })
        }
    })
});

// Update Status

router.post('/status',isAdmin,function(req,res){

    Order.updateOne({_id:req.body.orderId},{status:req.body.status}, function(err,data){
        
        if(err){

            console.log(err);
        }else{
            res.redirect('/admin/orders')
        }
    })
})






module.exports=router;
