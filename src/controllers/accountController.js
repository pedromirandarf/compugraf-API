const express = require('express');
const router = express.Router();
const req = require('request');
const request = require('request-promise');
require('dotenv').config()
const knex = require('../database');
const e = require('express');
const Chave = process.env.ACKEY;
var DataExtended =[];

let domainTrim = async(dominio) =>{

    let dominioC = String(dominio);
    if(dominioC.includes("www")){
    	let ar = dominioC.split(".");
      dominioC = (ar[0] === 'www')  ? ar[1] : ar[0];
    	dominioC = (ar[1] === 'com')  ? ar[0] : ar[1];
      console.log(dominioC);
    }
    if(dominioC.includes("https")||dominioC.includes("http")){
    	let ar = dominioC.split('//');
    	dominioC = (ar[0].includes("https")||dominioC.includes("http"))  ? ar[1] : ar[0];
        ar = dominioC.split(".");
        dominioC = (ar[0].includes("www"))  ? ar[1] : ar[0];
 		//dominioC = (ar[1].includes("com"))  ? ar[0] : ar[1];
    }
    console.log(dominioC);
    return dominioC;
};


async function extendData(allData){
    console.log("ExtendData");
    console.log(allData["accounts"].length);
    console.log(allData["accounts"][2]["name"]);
    for(let j=0;j<allData["accounts"].length; j++){
        if(allData["accounts"][j]["name"]!==null && allData["accounts"][j]["accountUrl"] !== null && allData["accounts"][j]["accountUrl"] !== ""){
            if(allData["accounts"][j]["accountUrl"] !== undefined){
                let Dominio= await domainTrim(allData["accounts"][j]["accountUrl"]);
                 console.log(`Push ${DataExtended.length}`);
                 DataExtended.push({
                    Empresa: allData["accounts"][j]["name"],
                    Dominio: Dominio
                 });
            }
            
        }
    }

};

let insertBD= async(accounts) =>{
    console.log("Inserindo no BD");
   await knex('accounts').truncate();
   await knex('accounts').insert(accounts);
    DataExtended =[];
}


let colect_data = async (req,res)=>{
    let account_data = [];

    console.log("Inciando coleta de dados");
    var endpoint = "/api/3/accounts?limit=100";
    
    var allData = await request({
        method: 'GET',
        url: `https://compugraf55051.api-us1.com${endpoint}`,
        headers:{
            "Api-Token": Chave
        },
        json: true
    });
    var dataSize = parseInt(allData["meta"]["total"]);
    dataSize = parseInt((dataSize+6)/100);
   
    for(let i=1; i<dataSize; i++){
        console.log(i);
       if(allData["accounts"].length == 0){
           console.log("OK");
           break;
        }
       let offset;
        offset = i*100;
        endpoint = `/api/3/accounts?limit=100&offset=${offset}`;
        allData = await request({
            method: 'GET',
            url: `https://compugraf55051.api-us1.com${endpoint}`,
            headers:{
                "Api-Token": Chave
            },
            json: true
        });

       await extendData(allData);


    }   
   

    
    //console.log(allData);
    
    return DataExtended;
};










router.get('/account', async(req,res)=>{
    try{
        const accounts = await colect_data();
        await insertBD(accounts);
        
        return res.send({
            message: `Foram coletados ${accounts.length} de Accounts Válidas`,
            Data: accounts
        });
    }catch(err){
        console.log(err);
        return res.status(400).send({error: err})
    }
});



router.get('/account/bd', async(req,res)=>{
    try{
        let dom = req.query.id; 
        var accounts = await knex('accounts')
        .where('Dominio',dom)
        .select();
        
        return res.send({
            message: `Foram coletados ${accounts.length} de Accounts Válidas`,
            Data: accounts
        });
    }catch(err){
        console.log(e);
        return res.status(400).send({error: e})
    }
});


module.exports = app => app.use('/', router);