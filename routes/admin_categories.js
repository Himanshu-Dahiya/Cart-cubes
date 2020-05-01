var express=require('express');
var router=express.Router();
var Category=require('../models/category');
var auth=require('../config/authenticate');
var isAdmin=auth.isAdmin;

router.get('/',isAdmin,(req,res)=>{
    Category.find({})
    .then(categories=>{
        res.render('admin/categories',{
            categories:categories
        })
    })
    .catch(err=>console.log(err));
});

router.get('/add-category',isAdmin,(req,res)=>{
    var title='';

    res.render('admin/add_category',{
        title:title
    })
});

router.post('/add-category',(req,res)=>{
    
    req.checkBody('title','Title must have a value').notEmpty();

    var title=req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();

    var errors = req.validationErrors();

    if (errors) {
        res.render('admin/add_category', {
            errors: errors,
            title: title
        });
    }
    else {
        Category.findOne({slug: slug}, function (err, category) {
            if (category) {
                //req.flash('danger', 'Page slug exists, choose another.');
                res.render('admin/add_category', {
                    title: title
                });
            } else {
                var category = new Category({
                    title: title,
                    slug: slug
                });

                category.save(function (err) {
                    if (err)
                        return console.log(err);
                    //req.flash('success', 'Page added!');
                    Category.find({})
                    .then(categories=>{
                       req.app.locals.categories=categories;
                        })
                    .catch(err=>console.log(err));
                    res.redirect('/admin/categories');
                 });
            }
        });
    }
});


router.get('/edit-category/:id',isAdmin,(req,res)=>{

    Category.findById(req.params.id)
    .then(category=>{
    res.render('admin/edit_category',{
        title:category.title,
        id:category._id
    })
    })
    .catch(err=>console.log(err))
});


router.post('/edit-category/:id',(req,res)=>{
 
    req.checkBody('title','Title must have a value').notEmpty();

    var title=req.body.title;

    var slug = title.replace(/\s+/g, '-').toLowerCase();
    
    var id=req.params.id;
    var errors = req.validationErrors();
    if (errors) {
        res.render('admin/edit_category', {
            errors: errors,
            title: title,
            id:id
        });
    }
    else {
        Category.findById(id)
        .then(category=>{
            if (category) {
                category.title=title;
                category.slug=slug;
                //req.flash('danger', 'Page slug exists, choose another.');
                category.save(function (err) {
                    if (err)
                        return console.log(err);
                    //req.flash('success', 'Page added!');
                    Category.find({})
                    .then(categories=>{
                       req.app.locals.categories=categories;
                        })
                    .catch(err=>console.log(err));
                    res.redirect('/admin/categories/edit-category/'+category.id);    
                })         
                }
            })
            .catch(err=>console.log(err));
            }
});


router.get('/delete-category/:id',isAdmin,(req,res)=>{
    Category.findByIdAndRemove(req.params.id)
    .then(()=>{
        Category.find({})
           .then(categories=>{
               req.app.locals.categories=categories;
                })
            .catch(err=>console.log(err));
        res.redirect('/admin/categories');
    })
    .catch(err=>console.log(err));
});

module.exports=router;