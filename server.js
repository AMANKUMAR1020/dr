require('dotenv').config()
require('express-async-errors')
const express = require("express");
const app = express();
const path = require('path')
const {logger,logEvents} = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser')
const cors = require('cors');
const corsOptions = require('./config/corsOptions.js')
const credentials = require('./middleware/credentials');
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3500;

console.log(process.env.NODE_ENV)

connectDB()


app.use(logger);
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false}));
app.use(express.json());
app.use(cookieParser());

app.use('/',express.static(path.join(__dirname,'/public')));

// routes
app.use('/',require('./routes/root.js'))
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/dr_details',require('./routes/dr_detailsRoutes.js'))
app.use('/client_details',require('./routes/client_detailsRoutes.js'))

app.get('/*',(req,res)=>{res.status(404).sendFile(path.join(__dirname,'views','404.html'));})

app.use(function(err,req,res,next){console.error(err.stack)
    res.status(500).send(err.message);})

app.all('*',(req,res)=>{
    res.status(404);
    if(req.accepts('http')){
        res.sendFile(path.join(__dirname,'view','404.html'))
    }else if(req.accepts('json')){
        res.json({error:'404 NOt Found created by me'})
    }else {
        res.type('txt').send('404 Not Found');
    }
});
app.use(errorHandler);


mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})