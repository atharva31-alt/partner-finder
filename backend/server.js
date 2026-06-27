const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const authRoutes = require('./routes/auth'); 
const requestRoutes = require('./routes/requests'); 

const app = express();

connectDB();

app.use(cors()); 
app.use(express.json()); 

app.use('/api/auth', authRoutes);       

console.log("✈️ Attempting to load request routes from routes/requests.js...");
app.use('/api/requests', requestRoutes); 
console.log("✅ Request routes successfully mounted onto /api/requests");

app.get('/', (req, res) => {
    res.send('API running smoothly...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Server ignited on port ${PORT}`));