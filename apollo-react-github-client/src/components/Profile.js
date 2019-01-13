import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";

import Loading from "./Loading";
import RepositoryList from "./Repository/RepositoryList";
import { REPOSITORY_FRAGMENT } from "./Repository/fragments";
import ErrorMessage from "./ErrorMessage";

const GET_REPOSITORIES_OF_CURRENT_USER = gql`
  {
    viewer {
      repositories(first: 5, orderBy: { field: STARGAZERS, direction: DESC }) {
        edges {
          node {
            ...repository
          }
        }
      }
    }
  }
  ${REPOSITORY_FRAGMENT}
`;

const Profile = () => (
  <Query query={GET_REPOSITORIES_OF_CURRENT_USER}>
    {({ data, error, loading }) => {
      if (error) {
        return <ErrorMessage error={error} />;
      }

      const { viewer } = data;

      if (loading || !viewer) {
        return <Loading />;
      }

      return <RepositoryList repositories={viewer.repositories} />;
    }}
  </Query>
);

export default Profile;
