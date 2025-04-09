const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors"); 


const app = express();
require('dotenv').config(); 

app.use(cors());

// Middleware
app.use(express.json());

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to MongoDB');
        
        app.listen(process.env.PORT ||4000, () => {
            console.log(`Server started on port ${process.env.PORT || 3000}`);
        });
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};



dbConnect();
