import { typeDefs } from "./graphql-schema";
import { ApolloServer} from "apollo-server";
import { v1 as neo4j } from "neo4j-driver";
import { makeAugmentedSchema } from "neo4j-graphql-js";
import dotenv from "dotenv";

dotenv.config();

const schema = makeAugmentedSchema({
  typeDefs
});

const driver = neo4j.driver(
  process.env.NEO4J_URI || "bolt://localhost:7687",
  neo4j.auth.basic(
    process.env.NEO4J_USER || "neo4j",
    process.env.NEO4J_PASSWORD || "neo4j"
  )
);

const server = new ApolloServer({
  // using augmentedSchema (executable GraphQLSchemaObject) instead of typeDefs and resolvers
  //typeDefs,
  //resolvers,
  context: { driver },
  // remove schema and uncomment typeDefs and resolvers above to use original (unaugmented) schema
  schema
});

server.listen().then(({ url }) => {
  console.log(`GraphQL API read at ${url}`);
});