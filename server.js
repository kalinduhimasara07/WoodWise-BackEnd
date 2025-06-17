// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();

// app.use(cors({
//     origin: 'http://localhost:5173',
//     credentials: true
// }));

// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// mongoose.connect(process.env.MONGODB_URI, { 
//     auth: {
//         username: process.env.MONGODB_USERNAME, 
//         password: process.env.MONGODB_PASSWORD 
//     }
// })
// .then(() => console.log('MongoDB connected'))
// .catch(err => console.error('MongoDB connection error:', err));

// app.use('/uploads', express.static('uploads'));

// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/furniture', require('./routes/furniture'));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });