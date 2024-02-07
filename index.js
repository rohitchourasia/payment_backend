const express = require('express');
const { router } = require('./route');
const cors = require('cors')
const app = express() ; 
app.use(cors()) ; 
app.use(express.json()) ; 
app.use('/api/v1',router);
app.listen(3000);