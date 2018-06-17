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
           groups(first: 3) {
             title
             city
             country
             tags(first:3) {name}
           }
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
          <li key={i}>{u.name} <ul>{u.groups.map((g,i) => (<li key={i}>{g.title} ({g.city} in {g.country} {g.tags.map((t)=>t.name).join(", ")})</li>))}</ul></li>
          ))}
        </ul>
        </div>
      );
    }}
  </Query>
);
export default UserList;