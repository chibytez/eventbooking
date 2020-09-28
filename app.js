import express from 'express';
import bodyParser from 'body-parser';
import {graphqlHTTP} from 'express-graphql';
import mongoose from 'mongoose';

import graphQlSchema from './graphql/schema/index'
import graphQlResolvers from './graphql/resolvers/index'

const app = express();

app.use(bodyParser.json())

app.use(
  '/graphql', 
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
}));

mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.oebvl.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
    ).then(()=>{
  app.listen(3000);
}).catch(err => {
  console.log(err);
})

