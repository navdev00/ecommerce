var express = require('express');
var router = express.Router();

var auth =require('../config/auth');
var isAdmin= auth.isAdmin;




//page model
var Page = require('../models/page');



// get admin page index

router.get('/',isAdmin, function (req, res) {

    Page.find({}).sort({ sorting: 1 }).exec(function (err, pages) {

        res.render('admin/page', { pages: pages })
    })

});


// Get add page

router.get('/add-page', isAdmin,function (req, res) {
    var title="";
    var slug ="";
    var content="";

    res.render('admin/add_page',{
        title:title,
        slug:slug,
        content:content
    });
});


//post add page

router.post('/add-page',isAdmin, function (req, res) {


    var title = req.body.title;
    var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();

    if (slug=="") slug= title.replace(/\s+/g, '-').toLowerCase();
    var content = req.body.content;

    req.checkBody('title', 'Title must have value.').notEmpty();
    req.checkBody('content', 'Content must have value.').notEmpty();


    var errors = req.validationErrors();

    if (errors) {
        res.render('admin/add_page', {
            errors: errors,
            title: title,
            slug: slug,
            content: content

        });

    } else {
        Page.findOne({ slug: slug }, function (err, page) {

            if (page) {
                req.flash('danger', 'Page exists , Choose another.');
                res.render('admin/add_page', {

                    title: title,
                    slug: slug,
                    content: content

                });

            } else {
                var page = new Page({

                    title: title,
                    slug: slug,
                    content: content

                });

                page.save(function (err) {
                    if (err) {
                        console.log(err);
                    } else {

                        req.flash('success', 'Page added');
                        res.redirect('/admin/pages');
                    }

                });

            }
        });
    }

});


// // GET Edit page

router.get('/edit-page/:id',isAdmin, function (req, res) {
  
 
  Page.findById( req.params.id, function(err,page){
       if (err) return console.log(err);

       res.render('admin/edit_page',{
           title:page.title,
           slug:page.slug,
           content:page.content,
           id:page._id
       });
      
   });
  
});


// get edit page


router.post('/edit-page/:id', isAdmin,function (req, res) {


    var title = req.body.title;
    var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();

    if (slug=="") slug= title.replace(/\s+/g, '-').toLowerCase();
    var content = req.body.content;
    var id =req.params.id;

    req.checkBody('title', 'Title must have value.').notEmpty();
    req.checkBody('content', 'Content must have value.').notEmpty();


    var errors = req.validationErrors();

    if (errors) {
        res.render('admin/edit_page', {
            errors: errors,
            title: title,
            slug: slug,
            content: content,
            id:id

        });

    } else {
        Page.findOne({ slug: slug , _id:{'$ne':id} }, function (err, page) {

            if (page) {
                req.flash('danger', 'Page exists , Choose another.');
                res.render('admin/edit_page', {

                    title: title,
                    slug: slug,
                    content: content,
                    id:id

                });

            } else {
             

                Page.findById(id, function(err,page){
                    if (err) return console.log(err);

                    page.title=title;
                    page.slug=slug;
                    page.content=content;

                    page.save(function (err) {
                        if (err) {
                            console.log(err);
                        } else {
    
                            req.flash('success', 'Page updated');
                            res.redirect('/admin/pages');
                        }
    
                    });


                });

              

            }
        });
    }

});





// Get delete page 


router.get ('/delete-page/:id',isAdmin,function(req,res){

    Page.findByIdAndRemove(req.params.id, function(err){
        if (err)
        return console.log(err);


        req.flash('success', 'Page Deleted.');
        res.redirect('/admin/pages');
    });
})


module.exports = router;
