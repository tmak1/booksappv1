import mongoose from 'mongoose';

const url = process.env.MONGODB;
const options = {
  useUnifiedTopology: true,
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: true,
};

const db = async () => {
  try {
    const conn = await mongoose.connect(url, options);
    //mongoose.set('debug', true);
    console.log('Mdb connected');
    return conn;
  } catch (error) {
    console.log('Mdb failed connection');
    throw error;
  }
};

export default db;
