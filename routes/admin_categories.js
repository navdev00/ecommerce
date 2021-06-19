var express = require('express');
var router = express.Router();

 var auth =require('../config/auth');
 var isAdmin= auth.isAdmin;




//category model
var Category = require('../models/category');


//get category index

router.get('/',isAdmin, function (req, res) {
    Category.find(function (err, categories) {
        if (err) return console.log(err);

        res.render('admin/category', {
            categories: categories
        });
    })
});

// get add category 

router.get('/add-category',isAdmin, function (req, res) {
    var title = "";


    res.render('admin/add_category', {
        title: title
    })
});


//post add category

router.post('/add-category',isAdmin, function (req, res) {

    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();

    req.checkBody('title', 'Title must have a value').notEmpty();

    var errors = req.validationErrors();

    if (errors) {

        res.render('admin/add_category', {
            errors: errors,
            title: title,
            slug: slug
        });

    } else {

        Category.findOne({ slug: slug }, function (err, category) {

            if (category) {
                req.flash('danger', 'Category exists, Choose Another');
                res.render('/admin/add_category', {

                    title: title
                });


            } else {

                var category = new Category({
                    title: title,
                    slug: slug

                });

                category.save(function (err) {
                    if (err)
                        console.log(err);

                    Category.find(function (err, categories) {
                        if (err) {
                            console.log(err);

                        } else {
                            req.app.locals.categories = categories;

                        }
                    });


                    req.flash('success', 'Category Added');
                    res.redirect('/admin/categories');

                })
            }
        })
    }

});

//edit categories

router.get('/edit-category/:id', isAdmin, function (req, res) {

    Category.findById(req.params.id, function (err, category) {
        if (err) return console.log(err);

        res.render('admin/edit_category', {
            title: category.title,
            id: category._id
        });

    })
});

//edit post categories

router.post('/edit-category/:id',isAdmin, function (req, res) {

    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();
    var id = req.params.id;


    req.checkBody('title', 'Title must have a value').notEmpty();


    var errors = req.validationErrors();

    if (errors) {
        res.render('admin/edit_category', {
            errors: errors,
            title: title,
            id: id
        });
    } else {
        Category.findOne({ slug: slug, _id: { '$ne': id } }, function (err, category) {
            if (category) {
                req.flash('danger', ' Category title exists, Choose another.');
                res.render('admin/edit_category', {
                    title: title,
                    id: id
                });

            } else {
                Category.findById(id, function (err, category) {

                    if (err) return console.log(err);

                    category.title = title;
                    category.slug = slug;

                    category.save(function (err) {
                        if (err) return console.log(err);



                        Category.find(function (err, categories) {
                            if (err) {
                                console.log(err);

                            } else {
                                req.app.locals.categories = categories;

                            }
                        });



                        req.flash('success', ' Category Updated');
                        res.redirect('/admin/categories');

                    })

                });

            }
        })
    }


});


// delete category

router.get('/delete-category/:id', isAdmin,function (req, res) {

    Category.findByIdAndRemove(req.params.id, function (err) {
        if (err) return console.log(err);


        Category.find(function (err, categories) {
            if (err) {
                console.log(err);

            } else {
                req.app.locals.categories = categories;

            }
        });

        

        req.flash('success', 'Category Deleted.');
        res.redirect('/admin/categories');
    })
});



module.exports = router;