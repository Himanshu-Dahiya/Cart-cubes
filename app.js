var express=require('express');
var path =require('path');
var mongoose=require('mongoose');
var config=require('./config/database');
var bodyParser=require('body-parser');
var session=require('express-session');
var expressValidator=require('express-validator');
var passport = require('passport');
var authenticate = require('./config/authenticate');


var pages=require('./routes/pages');
var adminPages=require('./routes/admin_pages');
var adminCategories=require('./routes/admin_categories');
var adminProducts=require('./routes/admin_products');
var products=require('./routes/products');
var cart=require('./routes/cart');
var users=require('./routes/users');

const connect=mongoose.connect(config.mongoUrl);
connect.then(()=>{
    console.log('connected to mongo');
})
.catch(err=>{
    console.log(err);
});


var app=express();

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use(express.static(path.join(__dirname,'public')));  //for static pages

app.locals.errors=null;

var Page =require('./models/page');

Page.find({}).sort({sorting:1})
    .then(pages=>{
       global.pages=pages;
        })
    .catch(err=>console.log(err));


var Category =require('./models/category');

Category.find({})
    .then(categories=>{
       app.locals.categories=categories;
        })
    .catch(err=>console.log(err));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use(session({
    name: 'session-id',
    secret: '12345-67890-09876-54321',
    saveUninitialized: true,
    resave: true,
    //cookie:({maxAge:1000})
  }));

  app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
                , root = namespace.shift()
                , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }  
  }));

app.use(passport.initialize());
app.use(passport.session());

//require('./config/authenticate')(passport);
app.get('*', function(req,res,next) {
    res.locals.user = req.user || null;
    next();
 });

app.use('/products',products);
app.use('/cart',cart);
app.use('/users',users);
app.use('/',pages);
app.use('/admin/pages',adminPages);
app.use('/admin/categories',adminCategories);
app.use('/admin/products',adminProducts);

var port=3000;

app.listen(port,()=>{
    console.log('Connected correctly to server');
});

 // "start":"nodemon app",
    // "start-server":"node app"