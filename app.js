import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';

import db from './src/shared/db/mongodb.js';
import { typeDefs, resolvers } from './src/schema/schema.js';
import { checkAuth } from './src/middleware/checkAuth.js';
import authRoutes from './src/routes/authRoutes.js';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => {
    return checkAuth(req);
  },
});

server.applyMiddleware({ app, path: '/api/graphql' });

app.use('/api/uploads', express.static(path.resolve(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);

app.use((error, req, res, next) => {
  console.log(error.message);
  console.log(error.code);

  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.log(err);
        console.log('Image not deleted', req.file.path);
      }
    });
  }
  if (!res.headersSent) {
    res.status(error.code).json({ message: error.message, code: error.code });
  }
  next(error);
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'client', 'build')));
}
app.use('/*', (req, res, next) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

try {
  await db();
  app.listen({ port: process.env.PORT }, () => {
    console.log(
      `Listening: http://${process.env.HOST}:${process.env.PORT}${server.graphqlPath}`
    );
  });
} catch (error) {
  console.log('Mdb failed: ', error);
}
