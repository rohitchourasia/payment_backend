
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://chourasiaeshan:Dhndumkol@cluster0.tt5jdyq.mongodb.net/Courses');
const schema = new mongoose.Schema({
    firstname:String , 
    lastname: String,
    username: String ,
    password: String
})

const User = new mongoose.model('User',schema)
const Accountschema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId , 
        ref : 'User',
        required:true 
    },
    balance:{
        type:Number , 
        required:true 
    }
})
const Account = new mongoose.model('Account',Accountschema)
module.exports={
    User,
    Account
}