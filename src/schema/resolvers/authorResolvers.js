import Author from '../../models/author.js';

export const findAllAuthors = async () => {
  let authors;
  try {
    authors = await Author.find({});
    if (!authors) {
      throw new HttpError('Could not find authors', 404);
    }
    return authors;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const findAuthorById = async (parent, { id }) => {
  let author;
  try {
    author = await Author.findById(id);
    if (!author) {
      throw new HttpError('Could not find author', 404);
    }

    return author;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const findAuthorOfBook = async ({ authorId }) => {
  let author;
  try {
    author = await Author.findById(authorId);
    if (!author) {
      throw new HttpError('Could not find author', 404);
    }
    return author;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const createAuthor = async (parent, { authorInputs: { name, age } }) => {
  let author;
  try {
    const authorExists = await Author.findOne({ name });
    if (authorExists) {
      throw new HttpError('That author already exists', 422);
    }
    author = new Author({
      name,
      age,
    });
    author = await author.save();
    if (!author) {
      throw new HttpError('Could not create author', 500);
    }
    return author;
  } catch (error) {
    console.log(error);
  }
};
