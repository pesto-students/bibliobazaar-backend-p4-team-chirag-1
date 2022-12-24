import mongoose from 'mongoose'
import uniqueValidator from "mongoose-unique-validator"

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  emailId: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
},
  { timestamps: true },
);

const users = mongoose.model('users', userSchema);

// userSchema.plugin(uniqueValidator, { message: "Email already in use." });

export default users