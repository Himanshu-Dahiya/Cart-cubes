var mongoose =require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    // username:{
    //     type:String,
    //     required:true
    // },
    // password:{
    //     type:String,
    //     required:true
    // },
    admin:{
        type:Number
    },
    cart:{
        type:Array
    }
    
});

UserSchema.plugin(passportLocalMongoose);

var User=mongoose.model('User',UserSchema);

module.exports=User;