
const express = require('express')
const app = express();
const path = require('path')

app.get('^/$|/index(.html)?',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','views','index.html'))
})

app.get('/new-page(.html)?',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','views','new-page.html'))
})

app.get('/register(.html)?',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','routes','register.html'))
})

app.get('/old-page(.html)?',(req,res)=>{
    res.redirect(301,'new-page.html');//302 by default;
})


module.exports = app;
