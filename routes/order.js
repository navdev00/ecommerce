var express = require('express');
var router = express.Router();
var Order = require('../models/order');
var moment = require('moment')

var auth = require('../config/auth');
var isUser = auth.isUser;


router.post('/', isUser, function (req, res) {

    //Validate request

    const { name, phone, landmark, address, town } = req.body

    if (!name || !phone || !landmark || !address || !town) {

        req.flash('error', 'All fields are required')
        return res.redirect('/cart/checkout')
    }

    const order = new Order({
        customerId: req.user._id,
        items: req.session.cart,
        name,
        phone,
        landmark,
        address,
        town
    });
    order.save(function (err) {
        if (err) {
            req.flash('error', 'Something went wrong')

            res.redirect('/cart/checkout')
        } else {
            req.flash('success', 'Order Placed Successfully')
            delete req.session.cart
            return res.redirect('/order/myorders')
        }
    })
});

router.get('/myorders', isUser, function (req, res) {

    Order.find({ customerId: req.user._id }, null, { sort: { 'createdAt': -1 } }, function (err, orders) {
        if (err) {
            console.log(err);
        } else {
            res.render('myorders', {
                orders: orders,
                moment: moment
            })
        }
    })
});

router.get('/myorders/:id',isUser, function (req, res) {

    Order.findById(req.params.id, function (err, order) {

        if (err) {
            console.log(err);
        } else {

            // Authorize User
            if (req.user._id.toString() === order.customerId.toString()) {
                res.render('singleOrder', {
                    order: order,
                    moment:moment
                })
            }
        }
    })
})

module.exports = router;
