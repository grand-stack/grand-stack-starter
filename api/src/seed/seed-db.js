import ApolloClient from "apollo-client";
import gql from "graphql-tag";
import dotenv from "dotenv";
import seedmutations from "./seed-mutations";
import fetch from "node-fetch";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

dotenv.config();

const {
  GRAPHQL_SERVER_HOST: host,
  GRAPHQL_SERVER_PORT: port,
  GRAPHQL_SERVER_PATH: path,
} = process.env;

const uri = `http://${host}:${port}${path}`;

const client = new ApolloClient({
  link: new HttpLink({ uri, fetch }),
  cache: new InMemoryCache(),
});

client
  .mutate({
    mutation: gql(seedmutations),
  })
  .then((data) => {
    console.log(data);
    console.log(`Database seeded! You can now query your GraphQL API at ${uri} `);
  })
  .catch((error) => console.error(error));
