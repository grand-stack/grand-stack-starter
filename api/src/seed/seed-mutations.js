export default /* GraphQL */ `
  mutation {
    u1: CreateUser(id: "u1", name: "Hakan") {
      id
      name
    }
  }
`;
