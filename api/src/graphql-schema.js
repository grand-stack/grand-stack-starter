import { neo4jgraphql } from "neo4j-graphql-js";

export const typeDefs = `

type GitHubUser {
    id: ID!
    type: String
    repositories(first: Int = 10, offset: Int = 0): [Repository] @relation(name:"CREATED", direction:"OUT")

    name: String
    location: String
    avatarUrl: String
    full_name: String
    followers: Int
}

type Tag {
    name: ID!
    tagged: [Repository] @relation(name:"TAGGED", direction:"IN")
}

type Repository {
	id: ID!
    title: String!
    full_name: String
    url: String
    created: Int
    homepage: String
    favorites: Int
    updated: Int
    pushed: Int
    size: Int
    score: Float
    watchers: Int
    language: String
    forks: Int
    open_issues: Int
    branch: String
    description: String
    owner: GitHubUser @relation(name:"CREATED", direction: "IN")
    tags: [Tag] @relation(name:"TAGGED", direction:"OUT")
}

type Query {
    users(id: ID, name: String, first: Int = 10, offset: Int = 0): [GitHubUser] 
    repository(id: ID, title: String, first: Int = 10, offset: Int = 0): [Repository]
    tag(name: ID!): Tag
}

`;

export const resolvers = {
  Query: {
    users: neo4jgraphql,
    repository: neo4jgraphql,
    tag: neo4jgraphql
  }
};
