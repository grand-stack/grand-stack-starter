export const typeDefs = `
type SOUser {
    id: ID!
    questions: [Question] @relation(name:"POSTED", direction:"OUT")
    answers: [Answer] @relation(name:"POSTED", direction:"OUT")
    reputation: Int
    name: String
    location: String
    profile_image_url: String
}

type Tag {
    name: ID!
    tagged: [Question] @relation(name:"TAGGED", direction:"IN")
}

type Question {
    id: ID!
    title: String
    link: String
    score: Int
    text: String

    closed_date: Int
    closed_reason: String

    favorites: Int
    view_count: Int
    comment_count: Int
    is_answered: Boolean 
    created: Int
    updated: Int
    answers(first: Int = 10, offset: Int = 0): [Answer] @relation(name:"ANSWERED", direction:"IN")
    author: SOUser @relation(name:"POSTED", direction:"IN")
    tags: [Tag] @relation(name:"TAGGED", direction:"OUT")
}

type Answer {
    id: ID!
    text: String 
    comment_count: Int
    is_accepted: Boolean
    created: Int
    score: Int
    question: Question @relation(name:"ANSWERED", direction:"OUT")
    author: SOUser @relation(name:"POSTED", direction:"IN")
}
`;