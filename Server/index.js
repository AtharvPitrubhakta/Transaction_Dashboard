const express = require("express");
require("dotenv").config();
const mongoose = require('mongoose');
const database = require("./config/DBConnect");
const apiRoutes = require("./routes/Transaction_Routes");
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 5000;

// Middleware Convert Into JSON Format
app.use(express.json());

// Web Link 
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    const allowedOrigins =["http://localhost:3000","*","https://trasaction.vercel.app/"]
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-credentials", false);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE, PATCH");
    next();
  });


// Body Parser
app.use(bodyParser.json());

// API
app.use("/api/transaction", apiRoutes);

// Connect with database
database.connect();

// default route
app.get("/", (req,res) => {
    return res.json({
        success:true,
        message:'Your server is up and running....'
    })    
});    

// Show message with port number
app.listen(PORT, ()=> {
    console.log(`App is running at ${PORT}`)
});    



