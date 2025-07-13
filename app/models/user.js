import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, unique: true, default: "" },
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  profession: { type: String, default: "" },
  city: { type: String, default: "" },
  state: { type: String, default: "" },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
export { User };
