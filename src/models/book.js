import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      length: { min: 3 },
      unique: true,
      required: true,
    },
    genre: {
      type: String,
      trim: true,
      required: true,
    },
    summary: {
      type: String,
      trim: true,
      length: { min: 3 },
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    authorId: {
      type: mongoose.Types.ObjectId,
      ref: 'author',
      required: true,
    },
  },
  { timestamps: true }
);

bookSchema.plugin(uniqueValidator);

const Book = mongoose.model('book', bookSchema);

export default Book;
