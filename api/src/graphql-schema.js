import { neo4jgraphql } from "neo4j-graphql-js";

export const typeDefs = `
type Link {
    url: ID!
}

type TwitterUser {
    id: ID!
    screen_name: String!
    name: String
    location: String
    followers: Int
    following: Int
    statuses: Int
    profile_image_url: String
    posted(first: Int = 10, offset: Int = 0): [Tweet] @relation(name:"POSTED", direction:"OUT")
}

type Tweet {
    id: ID!
    text: String
    created: Int
    favorites: Int
    postedBy: TwitterUser @relation(name:"POSTED", direction:"IN")
    mentioned: [TwitterUser] @relation(name:"MENTIONED", direction:"OUT")
    reply: Tweet @relation(name:"REPLIED_TO", direction:"OUT")
    retweeted: Tweet @relation(name:"RETWEETED", direction:"OUT")
    links: [Link] @relation(name:"LINKED", direction:"OUT")
    tags: [Tag] @relation(name:"TAGGED", direction:"OUT")
}

type Tag {
    name: ID!
    tagged: [Tweet] @relation(name:"TAGGED", direction:"IN")
}

type Query {
    users(id: ID, name: String, first: Int = 10, offset: Int = 0): [TwitterUser] 
    tweets(id: ID, text: String, first: Int = 10, offset: Int = 0): [Tweet]
    tag(name: ID!): Tag
}
`;

export const resolvers = {
  Query: {
    users: neo4jgraphql,
    tweets: neo4jgraphql,
    tag: neo4jgraphql
  }
};
