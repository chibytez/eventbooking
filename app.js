import express from 'express';
import bodyParser from 'body-parser';
import {graphqlHTTP} from 'express-graphql';
import {buildSchema} from 'graphql'

const app = express();

app.use(bodyParser.json())

app.use(
  '/graphql', 
  graphqlHTTP({
    schema: buildSchema(`

        type Query {
            events: [String!]!
        }

        type Mutation {
            createEvent(name: String): String
        }

        schema {
          query: Query 
          mutation: Mutation
        }
    `),
    rootValue: {
      events: () => {
        return ['ball', 'cycle', 'party']
      },
      createEvent: (args) => {
        const eventName = args.name;
        return eventName; 
      }
    },
    graphiql: true
}));

app.listen(3000);