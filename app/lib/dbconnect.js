// import mongoose from 'mongoose';

// const dbConnect = async () => {
//   if (mongoose.connection.readyState === 1) return;

//   try {
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log('Connected to MongoDB');
//   } catch (error) {
//     console.error('Error connecting to MongoDB:', error);
//     throw error;
//   }
// };

// export default dbConnect;

import mongoose from 'mongoose';

const dbConnect = async () => {
  if (mongoose.connection.readyState >= 1) return;

  return mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export default dbConnect;
