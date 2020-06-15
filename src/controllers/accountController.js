const express = require('express');
const router = express.Router();
const req = require('request');
const request = require('request-promise');
require('dotenv').config()
const Chave = process.env.ACKEY;

let colect_data = async (req,res)=>{
    let account_data = [];

    console.log("Inciando coleta de dados");
    var endpoint = "/api/3/accounts?limit=100&offset=100";
    
    var allData = await request({
        method: 'GET',
        url: `https://compugraf55051.api-us1.com${endpoint}`,
        headers:{
            "Api-Token": Chave
        },
        json: true
    });
    //const dataSize = allData["meta"]["total"];
    
    
    //console.log(allData);
    account_data = allData;

    return account_data;
};










router.get('/account', async(req,res)=>{
    try{
        const accounts = await colect_data();
        return res.send({
            message: "Tudo certo",
            Data: accounts
        });
    }catch(err){
        return res.status(400).send({error: err})
    }
});


module.exports = app => app.use('/', router);