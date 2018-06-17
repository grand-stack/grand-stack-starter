import { neo4jgraphql } from "neo4j-graphql-js";

export const typeDefs = `
type MeetupUser {
    id: ID!
    name: String
    updated: Int
    groups(first: Int = 10, offset: Int = 0): [Group] @relation(name:"JOINED", direction:"OUT")
    organizes: [Group] @relation(name:"CREATED", direction:"OUT")
    events(first: Int = 10, offset: Int = 0): [Event]  @relation(name:"ATTENDED", direction:"OUT")
}

type Tag {
    name: ID!
    tagged(first: Int = 10, offset: Int = 0): [Group] @relation(name:"TAGGED", direction:"IN")
}

type Group {
    id: ID!
    title: String!
    created: Int
    country: String
    city: String
    latitude: Float
    longitude: Float
    link: String
    text: String
    memberCount: Int
    score: Float
    key: String
    tags(first: Int = 10, offset: Int = 0): [Tag]  @relation(name:"TAGGED", direction:"OUT")
    members(first: Int = 10, offset: Int = 0): [MeetupUser]  @relation(name:"JOINED", direction:"IN")
    events(first: Int = 10, offset: Int = 0): [Event]  @relation(name:"CONTAINED", direction:"OUT")
    owners: [MeetupUser]  @relation(name:"CREATED", direction:"IN")
}

type Event {
    id: ID!
    title: String!
    created: Int
    past: Boolean
    status: String
    rsvp_limit: Int
    yes_rsvp_count: Int
    maybe_rsvp_count: Int
    score: Float
    headcount: Int
    text: String
    link: String
    utc_offset: Int
    time: Int
    updated: Int
    waitlist_count: Int
    attendees(first: Int = 10, offset: Int = 0): [MeetupUser] @relation(name:"ATTENDED", direction:"IN")
    owner: [MeetupUser] @relation(name:"CREATED", direction:"IN")
    venue: Venue @relation(name:"CONTAINED", direction:"IN")
    group: Group @relation(name:"HOSTED", direction:"IN")
}

type Venue {
    id: ID!
    name: String
    address: String
    city: String
    country: String
    country_name: String
    latitude: Float
    longitude: Float
    events(first: Int = 10, offset: Int = 0): [Event]  @relation(name:"CONTAINED", direction:"OUT")
}

type Query {
    users(id: ID, name: String, first: Int = 10, offset: Int = 0): [MeetupUser] 
    groups(id: ID, title: String, first: Int = 10, offset: Int = 0): [Group]
    venues(id: ID, name: String, city:String, country: String, first: Int = 10, offset: Int = 0): [Venue]
    tag(name: ID!): Tag
}
`;

export const resolvers = {
  Query: {
    users: neo4jgraphql,
    groups: neo4jgraphql,
    venues: neo4jgraphql,
    tag: neo4jgraphql
  }
};
