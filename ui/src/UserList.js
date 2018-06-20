import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import './UserList.css';

const UserList = () => (
  <Query
    query={gql`
      {
        matches(first:10) {
    id
    description
    home_team {
      name
    }
    away_team {
      name
    }
    h_score
    a_score
    date
  }
      }
    `}
  >
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error</p>;

      return (
          <div className="UserList">
          <h1>Matches:</h1>
        <ul>
          {data.matches.map(({date, home_team, away_team, h_score, a_score}, i) => (
          <li key={i}>On {date}: {home_team.name} {h_score}-{a_score} {away_team.name}</li>
          ))}
        </ul>
        </div>
      );
    }}
  </Query>
);

export default UserList;
