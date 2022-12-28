import mongoose from 'mongoose'
import uniqueValidator from "mongoose-unique-validator"

const LibBookSchema = new mongoose.Schema({
    bookId:{
      type: mongoose.Schema.Types.ObjectId,
      ref:"books",
      required: true,
    },
    quantity:{
      type:Number,
      required:true
    },
    availableBook:{
      type:Number
    },
    rentedBook:{
      type:Number
    },
    rentExpected:{
      type:Number,
      required:true
    }
});

const librarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
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

const library = mongoose.model('library', librarySchema);
librarySchema.plugin(uniqueValidator, { message: "Library for userId already present" });
export default library