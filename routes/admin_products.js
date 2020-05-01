var express=require('express');
var router=express.Router();
var Product=require('../models/product');
var Category=require('../models/category');
var auth=require('../config/authenticate');
var isAdmin=auth.isAdmin;

router.get('/',isAdmin,(req,res)=>{
    var count;
    Product.count({},(err,c)=>{
        count=c;
    });
    Product.find({})
    .then(products=>{
        res.render('admin/products',{
            products:products,
            count:count
        })
    })
    .catch(err=>console.log(err));
});

router.get('/add-product',isAdmin,(req,res)=>{
    var title='';
    var desc='';
    var price='';
    var image='';

    Category.find({}).then(categories=>{
    res.render('admin/add_product',{
        title:title,
        desc:desc,
        categories:categories,
        price:price,
        image:image
    })
    })
    .catch(err=>console.log(err));
});

router.post('/add-product',(req,res)=>{
    
    req.checkBody('title','Title must have a value').notEmpty();
    req.checkBody('desc','Description must have a value').notEmpty();
    req.checkBody('price','Price must have a value').isDecimal();
    req.checkBody('image','Image must have a value').notEmpty();

    var title=req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();
    var desc = req.body.desc;
    var price = req.body.price;
    var image = req.body.image;
    var category = req.body.category;

    var errors = req.validationErrors();

    if (errors) {
        Category.find({})
        .then(categories=>{
        res.render('admin/add_product', {
            errors: errors,
            title: title,
            desc: desc,
            price:price,
            categories:categories,
            image:image
        });
    })
    .catch(err=>console.log(err));
    }
    else {
        Product.findOne({slug: slug}, function (err, product) {
            if (product) {
                //req.flash('danger', 'Page slug exists, choose another.');
                res.render('admin/add_product', {
                    title: title,
                    desc: desc,
                    price:price,
                    image:image
                });
            } else {
                var product = new Product({
                    title: title,
                    desc: desc,
                    price:price,
                    image:image,
                    slug:slug,
                    category:category
                });

                product.save(function (err) {
                    if (err)
                        return console.log(err);
                    //req.flash('success', 'Page added!');
                    res.redirect('/admin/products');
                 });
            }
        });
    }
});


router.get('/edit-product/:id',isAdmin,(req,res)=>{

    var id =req.params.id;

    Category.find({})
    .then(categories=>{
        Product.findById(id)
        .then(product=>{
        res.render('admin/edit_product',{
            title:product.title,
            desc:product.desc,
            image:product.image,
            price:product.price,
            categories:categories,
            category:product.category,
            id:id
        })
        })
        .catch(err=>console.log(err));
    })
    .catch(err=>console.log(err));
});


router.post('/edit-product/:id',(req,res)=>{
    
    req.checkBody('title','Title must have a value').notEmpty();
    req.checkBody('desc','Description must have a value').notEmpty();
    req.checkBody('price','Price must have a value').isDecimal();
    req.checkBody('image','Image must have a value').notEmpty();

    var title=req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();
    var desc = req.body.desc;
    var price = req.body.price;
    var image = req.body.image;
    var category = req.body.category;
    var id = req.params.id;

    var errors = req.validationErrors();

    if (errors) {
        Category.find({})
        .then(categories=>{
        res.render('admin/edit_product', {
            errors: errors,
            title: title,
            desc: desc,
            price:price,
            categories:categories,
            category:category,
            image:image,
            id:id
        });
    })
    .catch(err=>console.log(err));
    }
    else {
        Product.findById(id)
        .then(product=>{
            if (product) {
                product.title= title;
                product.desc= desc;
                product.price=price;
                product.category=category;
                product.image=image;
                product.slug=slug;
                //req.flash('danger', 'Page slug exists, choose another.');
                product.save(function (err) {
                    if (err)
                        return console.log(err);
                    //req.flash('success', 'Page added!');
                    res.redirect('/admin/products/edit-product/'+id);    
                })         
                }
            })
            .catch(err=>console.log(err));
            }
});


router.get('/delete-product/:id',isAdmin,(req,res)=>{
    Product.findByIdAndRemove(req.params.id)
    .then(()=>{
        res.redirect('/admin/products');
    })
    .catch(err=>console.log(err));
});

module.exports=router;