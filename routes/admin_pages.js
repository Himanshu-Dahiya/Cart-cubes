var express=require('express');
var router=express.Router();
var Page=require('../models/page');
var auth=require('../config/authenticate');
var isAdmin=auth.isAdmin;

router.get('/',isAdmin,(req,res)=>{
    Page.find({}).sort({sorting:1})
    .then(pages=>{
        res.render('admin/pages',{
            pages:pages
        })
    })
    .catch(err=>console.log(err));
});

router.get('/add-page',isAdmin,(req,res)=>{
    var title='';
    var content='';
    var slug='';

    res.render('admin/add_page',{
        title:title,
        slug:slug,
        content:content
    })
});

router.post('/add-page',(req,res)=>{
    
    req.checkBody('title','Title must have a value').notEmpty();
    req.checkBody('content','Content must have a value').notEmpty();

    var title=req.body.title;

    var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if (slug == "")
        slug = title.replace(/\s+/g, '-').toLowerCase();
    
    var content = req.body.content;

    var errors = req.validationErrors();

    if (errors) {
        res.render('admin/add_page', {
            errors: errors,
            title: title,
            slug: slug,
            content: content
        });
    }
    else {
        Page.findOne({slug: slug}, function (err, page) {
            if (page) {
                //req.flash('danger', 'Page slug exists, choose another.');
                res.render('admin/add_page', {
                    title: title,
                    slug: slug,
                    content: content
                });
            } else {
                var page = new Page({
                    title: title,
                    slug: slug,
                    content: content,
                    sorting: 100
                });

                page.save(function (err) {
                    if (err)
                        return console.log(err);
                    Page.find({}).sort({sorting:1})
                    .then(pages=>{
                        req.app.locals.pages=pages;
                    })
                   .catch(err=>console.log(err));
                    //req.flash('success', 'Page added!');
                    res.redirect('/admin/pages');
                 });
            }
        });
    }
});


router.get('/edit-page/:id',isAdmin,(req,res)=>{

    Page.findById(req.params.id)
    .then(page=>{
    res.render('admin/edit_page',{
        title:page.title,
        slug:page.slug,
        content:page.content,
        id:req.params.id
    })
    })
    .catch(err=>console.log(err))
});


router.post('/edit-page/:id',(req,res)=>{
    
    req.checkBody('title','Title must have a value').notEmpty();
    req.checkBody('content','Content must have a value').notEmpty();

    var title=req.body.title;
    var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if (slug == "")
        slug = title.replace(/\s+/g, '-').toLowerCase();
    var content = req.body.content;
    var id=req.params.id;

    var errors = req.validationErrors();

    if (errors) {
        res.render('admin/edit_page', {
            errors: errors,
            title: title,
            slug: slug,
            content: content,
            id:id
        });
    }
    else {
        Page.findById(id)
        .then(page=>{
            if (page) {
                page.title=title;
                page.slug=slug;
                page.content=content;
                //req.flash('danger', 'Page slug exists, choose another.');
                page.save(function (err) {
                    if (err)
                        return console.log(err);
                    //req.flash('success', 'Page added!');
                    Page.find({}).sort({sorting:1})
                    .then(pages=>{
                       req.app.locals.pages=pages;
                        })
                    .catch(err=>console.log(err));
                    res.redirect('/admin/pages/edit-page/'+id);    
                })         
                }
            })
            .catch(err=>console.log(err));
            }
});


router.get('/delete-page/:id',isAdmin,(req,res)=>{
    Page.findByIdAndRemove(req.params.id)
    .then(()=>{
        Page.find({}).sort({sorting:1})
        .then(pages=>{
           req.app.locals.pages=pages;
            })
        .catch(err=>console.log(err));
        res.redirect('/admin/pages');
    })
    .catch(err=>console.log(err));
});

module.exports=router;