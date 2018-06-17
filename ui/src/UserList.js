import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import './UserList.css';
const UserList = () => (
  <Query
    query={gql`
      {
        users(first: 10) {
          name
          questions(first:3) { title, score, tags {name} }
        }
      }
    `}
  >
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error</p>;
      return (
          <div className="UserList">
          <h1>Users:</h1>
        <ul>
          {data.users.map((u,i)=> (
          <li key={i}>{u.name} <ul>{u.questions.map((q,i) => (<li key={i}>{q.title} ({q.score} {q.tags.map((t)=>t.name).join(", ")})</li>))}</ul></li>
          ))}
        </ul>
        </div>
      );
    }}
  </Query>
);
export default UserList;