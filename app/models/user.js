// import mongoose from 'mongoose';

// // User Schema

// const UserSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     createdAt: { type: Date, default: Date.now },
//   });

// // export default User = mongoose.models.User || mongoose.model('User', UserSchema);
// export default mongoose.models.User || mongoose.model('User', UserSchema);
import mongoose from 'mongoose';

// Define the User schema
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Check if the model exists already, otherwise create it
const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Export the User model
export { User };
