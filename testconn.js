const mongoose = require('mongoose');

const uri = 'mongodb://alphacoderaman:Aman@2004@expensetracker.mvzjm.mongodb.net/expensetracker?retryWrites=true&w=majority&appName=expenseTracker';

mongoose
  .connect(uri)
  .then(() => {
    console.log('Connected to MongoDB');
    mongoose.disconnect();
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
