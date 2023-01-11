import mongoose from 'mongoose'
import uniqueValidator from "mongoose-unique-validator"

const LibBookSchema = new mongoose.Schema({
    bookId:{
      type: mongoose.SchemaTypes.ObjectId,
      ref:"books",
      required: true,
    },
    availableBook:{
      type:Number
    },
    rentedBook:{
      type:Number,
      default:0
    },
    rentExpected:{
      type:Number,
      required:true
    }
});

const librarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref:"users",
    required: true,
  },
  books: {
    type: [LibBookSchema],
    require: true
  }
},
  { timestamps: true },
);

const library = mongoose.model('libraries', librarySchema);
librarySchema.plugin(uniqueValidator, { message: "Library for userId already present" });
export default library