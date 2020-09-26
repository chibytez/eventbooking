import express from 'express';
import bodyParser from 'body-parser';
import {graphqlHTTP} from 'express-graphql';
import {buildSchema} from 'graphql';
import mongoose from 'mongoose'

import Event from './models/event'

const app = express();

app.use(bodyParser.json())

app.use(
  '/graphql', 
  graphqlHTTP({
    schema: buildSchema(`
        
        type Event {
          _id: ID!
          title: String!
          description: String!
          price: Float!
          date: String!
        }

        input EventInput {
          title: String!
          description: String!
          price: Float!
          date: String!
        }

        type Query {
            events: [Event!]!
        }
 
        type Mutation {
            createEvent(eventInput: EventInput): Event
        }

        schema {
          query: Query 
          mutation: Mutation
        }
    `),
    rootValue: {
      events: () => {
       return Event.find()
        .then(events => {
          return events.map(event =>{
            return { ...event._doc }
          })
        })
        .catch(err => {
          throw err
        })
      },
      createEvent: args => {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date)
        });
        return event
          .save()
          .then(result=>{
            console.log(result);
            return {...result._doc};
          })
          .catch(err =>{
            console.log(err);
            throw err
          })
        }
    },
    graphiql: true
}));

mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.oebvl.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
    ).then(()=>{
  app.listen(3000);
}).catch(err => {
  console.log(err);
})

