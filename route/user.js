const express = require('express'); 
const userouter = express.Router() ; 
module.exports= userouter
const jwt = require('jsonwebtoken');
const zod = require('zod');
const JWT_SECRET = require('../config');
const { User, Account } = require('../db');
const { authMiddleware } = require('../middleware');
const userSchema = zod.object({
    firstname:zod.string() , 
    lastname : zod.string() , 
    username:zod.string() ,
    password :zod.string() 
})
const signIn = zod.object({
    username:zod.string() , 
    password:zod.string()  
})
const updateUser= zod.object({
    firstname:zod.string().optional() , 
    lastname:zod.string().optional() 
})
userouter.post('/signup', async function(req,res){
    const body = req.body ; 
    const num = 50 ; 
    console.log(body)
    const userData={
        firstname:req.body.firstname , 
        lastname:req.body.lastname , 
        username:req.body.username,
        password :req.body.password
    }
    const {success} = userSchema.safeParse(userData);
    console.log(success)
    if(success){
        const f  = await  User.findOne(body);
        if(f){
            return res.json({
                mssg:"user already there"
            })
        }
        else {
            const dbUser =  await User.create(body);
            const token = jwt.sign({userId:dbUser._id},JWT_SECRET);
            await Account.create({
                userId:dbUser._id,
                balance: num
            })
        
            res.json({
                mssg:"user created", 
                token:token 
            })
        }
    }
    else {
        return res.status(401).json({
            mssg:"provide correct inputs"
        })
    }
     

})
userouter.post('/signin',async function(req,res){
    const body = req.body
    
    console.log(body)
    const {success} = signIn.safeParse(body);
    console.log(success)
    if(!success){
       return  res.status(404).json({
            mssg: "pls provide valid input "
        })

    }
 
    const f  = await  User.findOne(body);
    console.log(f)
    
    if(f){
        const token = jwt.sign({userID:f._id},JWT_SECRET);
        return res.status(200).json({
            token:token,
            mssg:"user found",
            firstname:f.firstname , 

        })


    }
    res.status(401).json({
        mssg:"error while logging  in "
    })
    
    
})
userouter.put('/update',authMiddleware,async function(req,res){
    console.log(req.userId)
    const { success } = updateUser.safeParse(req.body)
    console.log(success)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }
    const filter = { _id: req.userId };

    const update = { $set: req.body };
    console.log(req.body)
    await User.updateOne(filter,update)
    console.log("here")

    res.json({
        message: "Updated successfully"
    })


})
userouter.get('/bulk',async function(req,res){
    const filter = req.query.filter||" " ; 
    const users = await User.find({
        $or:[
            {
                firstname:{
                    $regex: filter
                }
            },
            {
                lastname:{
                    $regex : filter
                }
            }
        ]
    })
    

     res.json({
        user:users.map(user=>({
            username: user.username,
            firstName: user.firstname,
            lastName: user.lastname,
            _id: user._id
        }))
     })
})