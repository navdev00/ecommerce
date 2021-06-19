var express = require('express');
const Product = require('../models/product');
var router = express.Router();
var fs = require('fs-extra');
var auth = require('../config/auth');
var isUser= auth.isUser;


//category model
var Category = require('../models/category');



// GET all products

router.get('/', function (req, res) {

    Product.find(function (err, products) {
        if (err)
            console.log(err);

        res.render('index', {
            products: products
        })
    })
});

// GET products by category


router.get('/:category', function (req, res) {

    var categorySlug = req.params.category;

    Category.findOne({ slug: categorySlug }, function (err, c) {
        Product.find({ category: categorySlug }, function (err, products) {
            if (err)
                console.log(err)

            res.render('products', {
               
                products: products
            });
        });

    })
})


//GET single product details

router.get('/products/:category/:product', function (req, res) {
    var galleryImages = null;
    // var loggedIn= (req.isAuthenticated()) ? true: false;


    Product.findOne({ slug: req.params.product }, function (err, product) {
        if (err) {
            console.log(err);
        } else {
            var galleryDir = 'public/product_images/' + product._id + '/gallery';
            fs.readdir(galleryDir, function (err, files) {
                if (err) {
                    console.log(err);
                } else {
                    galleryImages = files;

                    res.render('singleProduct', {
                        title: product.title,
                        p: product,
                        galleryImages: galleryImages,
                        // loggedIn:loggedIn
                    })
                }
            });
        }
    })
});





module.exports = router;