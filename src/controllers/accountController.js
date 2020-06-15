const express = require('express');
const router = express.Router();

router.get('/account', async(req,res)=>{
    try{
        return res.send("Top demais rogerinho");
    }catch(err){
        return res.status(400).send({error: err})
    }
});


module.exports = app => app.use('/', router);