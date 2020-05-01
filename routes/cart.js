var express=require('express');
var router=express.Router();
var Product=require('../models/product');
var User=require('../models/user');
var passport=require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passportLocalMongoose = require('passport-local-mongoose');


router.get('/add/:product',(req, res)=> {
    var slug = req.params.product;
    Product.findOne({slug: slug}).then(p=>{
        
        if (res.locals.user.cart.length===0) {
         //   res.locals.user.cart = [];
            res.locals.user.cart.push({
                title: slug,
                qty: 1,
                price: parseFloat(p.price).toFixed(2),
                image: p.image
            });
            res.locals.user.save();
        } else {
            
            var newItem = true;

            for (var i = 0; i < res.locals.user.cart.length; i++) {
                if (res.locals.user.cart[i].title === slug) {
                    res.locals.user.cart[i].qty++;
                    res.locals.user.markModified('cart');
                    newItem = false;
                    break;
                }
            }

            if (newItem) {
                res.locals.user.cart.push({
                    title: slug,
                    qty: 1,
                    price: parseFloat(p.price).toFixed(2),
                    image: p.image
                });
            }
            res.locals.user.save();
        }

        res.redirect('back');
    })
    .catch(err=>console.log(err));

});

router.get('/checkout',(req,res)=>{

    res.render('checkout',{
        title:'Checkout'
    });
});


router.get('/update/:product', function (req, res) {

    var slug = req.params.product;
    var action = req.query.action;

    for (var i = 0; i < res.locals.user.cart.length; i++) {
        if (res.locals.user.cart[i].title == slug) {
            switch (action) {
                case "add":
                    console.log(res.locals.user.cart[i].qty);
                    res.locals.user.cart[i].qty = res.locals.user.cart[i].qty + 1 ;
                    res.locals.user.markModified('cart');
                    console.log(res.locals.user.cart[i].qty);
                    break;
                case "remove":
                    //console.log(res.locals.user.cart[i-1].qty);
                    res.locals.user.cart[i].qty--;
                    res.locals.user.markModified('cart');
                    if (res.locals.user.cart[i].qty < 1)
                        res.locals.user.cart.splice(i, 1);
                    if (res.locals.user.cart.length == 0)
                        res.locals.user.cart=[];
                    break;
                case "clear":
                    res.locals.user.cart.splice(i, 1);
                    if (res.locals.user.cart.length == 0)
                        res.locals.user.cart=[];
                    break;
                default:
                    console.log('update problem');
                    break;
            }
            break;
        }
    }
    res.locals.user.save(err=>{
        if(err)
            console.log(err);
        res.redirect('/cart/checkout');
    });



});

router.get('/clear', function (req, res) {

    res.locals.user.cart=[];
    
    res.locals.user.save(err=>{
        if(err)
            console.log(err);
        res.redirect('/cart/checkout');
    });

});

router.get('/buynow',(req,res)=>{

    res.locals.user.cart=[];

    res.locals.user.save(err=>{
        if(err)
            console.log(err);
        res.redirect('/cart/checkout');
    });

});



module.exports=router;