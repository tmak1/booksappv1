import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      length: { min: 3 },
      unique: true,
      required: true,
    },
    age: {
      type: Number,
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
);

authorSchema.plugin(uniqueValidator);

const Author = mongoose.model('author', authorSchema);

export default Author;
