var mongoose =require('mongoose');

var CategorySchema=mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        required:true
    }
});

var Category=mongoose.model('Category',CategorySchema);

module.exports=Category;