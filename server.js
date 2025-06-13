const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { auth: {
    username: process.env.MONGODB_USERNAME, password: process.env.MONGODB_PASSWORD }
}).then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));