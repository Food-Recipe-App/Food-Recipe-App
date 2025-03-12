const mongoose = require('mongoose');
const { Schema } = mongoose;
const isEmail = require('validator/lib/isEmail'); 

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true, 
      minlength: [6, 'Username must be at least 6 characters long'] 
    },
    password: { type: String, required: true },
    avatar: { type: String, default: '' },
    email: {
      type: String,
      required: true, 
      unique: true, 
      lowercase: true, 
      validate: [isEmail, 'Invalid email format'] 
    },
    phoneNumber: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    registration_token: { type: String, default: null },
    role: { type: Schema.Types.ObjectId, ref: 'Role', required: true }
  }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
