var express=require('express');
var router=express.Router();
var Page=require('../models/page');


router.get('/',(req,res)=>{
    Page.findOne({slug:'home'})
    .then(page=>{
        res.render('index',{
            title:'Home',
            page:page
        })
    })
    .catch(err=>console.log(err));
});

router.get('/:slug',(req,res)=>{
    var slug=req.params.slug;

    Page.findOne({slug:slug})
    .then(page=>{
        if(!page)
            res.redirect('/');
        else{    
        res.render('index',{
            title:page.title,
            page:page
        })
    }
    })
    .catch(err=>console.log(err));
});


module.exports=router;