const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI, {
  auth: {
    username: process.env.MONGODB_USERNAME,
    password: process.env.MONGODB_PASSWORD
  }}).then(() => {
  console.log('MongoDB connected');

  const newUser = new User({
    username: 'testuser3',
    password: 'testpassword3',
    email: 'testuser3@gmail.com',
    role: 'owner',
  });

  newUser.save()
    .then(() => {
      console.log('User created successfully');
      mongoose.disconnect();
    })
    .catch(err => {
      console.error('Error creating user:', err);
      mongoose.disconnect();
    });

}).catch(err => {
  console.error('MongoDB connection error:', err);
});
