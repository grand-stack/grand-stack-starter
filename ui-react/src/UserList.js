import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

const GET_USER = gql`
  query usersPaginateQuery(
    $first: Int
    $offset: Int
    $orderBy: [_UserOrdering]
    $filter: _UserFilter
  ) {
    User(first: $first, offset: $offset, orderBy: $orderBy, filter: $filter) {
      id
      name
    }
  }
`;

function UserList(props) {
  const { loading, data, error } = useQuery(GET_USER);

  return (
    <div>
      {data && !loading && !error && (
        <div>
          {data.User.map(n => {
            return <div key={n.id}>Hello {n.name}</div>;
          })}
        </div>
      )}
    </div>
  );
}

export default UserList;
