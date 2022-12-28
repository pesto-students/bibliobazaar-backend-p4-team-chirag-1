import mongoose from 'mongoose'
import uniqueValidator from "mongoose-unique-validator"

const addressSchema = new mongoose.Schema({
  fullName: { 
    type: String,
    required: true
  },
  mobileNumber: { 
    type: Number,
    required: true
  },
  pincode: { 
    type: Number,
    required: true 
  },
  houseNumber: { 
    type: String,
    required: true 
  },
  area: { 
    type: String,
    required: true 
  },
  landmark: { type: String },
  city: { 
    type: String,
    required: true 
  },
  state: { 
    type: String,
    required: true  
  },
  addressType: { 
    type: String,
    required: true 
  },
  isDefault: { type: Boolean },
},
  { timestamps: true }
)

const userSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  firstName: {
    type: String,
    required: true,
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
  phoneNumber: {
    type: Number,
    required: false,
  },
  gender: {
    type: String,
    required: false,
  },
  dob: {
    type: Date,
    required: false,
  },
  profilePicture: {
    type: String,
    required: false,
  },
  cart: {
    contents: [{
      bookId: mongoose.ObjectId
    }],
    required: false,
  },
  addresses: [addressSchema]
},
  { timestamps: true },
);

const users = mongoose.model('users', userSchema);

/**
 *  Here we are creating and setting an id property and 
    removing _id, __v, and the password hash which we do not need 
    to send back to the client.
 */
userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.userId = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    //do not reveal passwordHash
    delete returnedObject.password;
  },
});

/**
 * 1. The userSchema.plugin(uniqueValidator) method won’t let duplicate email id to be stored in the database.
 * 2. The unique: true property in email schema does the internal optimization to enhance the performance.
 */
userSchema.plugin(uniqueValidator, { message: "Email already in use." });

export default users