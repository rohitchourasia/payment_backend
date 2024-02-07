const express = require('express');
const userouter = require('./user');
const accountrouter = require('./account');
const router = express.Router() ; 

module.exports={
    router
}
router.use("/user",userouter);
router.use("/account",accountrouter);