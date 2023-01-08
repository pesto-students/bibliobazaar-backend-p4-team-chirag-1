import mongoose from 'mongoose'
import uniqueValidator from "mongoose-unique-validator"

const bookSchema = new mongoose.Schema({
 bookName: {
    type: String,
    required: true,
  },
  author: {
    type: [String],
    required: true,
  },
  isbn: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String
  },
  imageUrl: {
    type: String
  },
  genre: {
    type: [String]
  },
  language: {
    type: String
  },
},
  { timestamps: true },
);


bookSchema.plugin(uniqueValidator, { message: "Books with same ISBN code already present" });
bookSchema.virtual('bookId').get(function() {
  return this._id;
});
const books = mongoose.model('books', bookSchema);
export default books