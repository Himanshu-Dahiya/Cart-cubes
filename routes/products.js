var express=require('express');
var router=express.Router();
var Product=require('../models/product');
var Category=require('../models/category');


router.get('/',(req,res)=>{

    Product.find({})
    .then(products=>{
        res.render('all_products',{
            title:'All Products',
            products:products
        })
    })
    .catch(err=>console.log(err));
});

router.get('/:category',(req,res)=>{

    var categorySlug=req.params.category;

    Category.findOne({slug:categorySlug})
    .then(c=>{
        Product.find({category:categorySlug})
        .then(products=>{
            res.render('cat_products',{
                products:products,
                title:c.title
            })
        })
        .catch(err=>console.log(err));
    })
    .catch(err=>console.log(err));

});


router.get('/:category/m/:product',(req,res)=>{

    Product.findOne({slug:req.params.product})
    .then(product=>{ 
        res.render('product',{
            p:product,
            title:product.title
        })
    })
    .catch(err=>console.log(err));
});


module.exports=router;