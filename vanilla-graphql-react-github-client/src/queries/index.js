import axios from "axios";

const axiosGitHubGraphQL = axios.create({
  baseURL: "https://api.github.com/graphql",
  headers: {
    Authorization: `bearer ${
      process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN
    }`
  }
});

const GET_ISSUES_OF_REPOSITORY = `
  query ($organization: String!, $repository: String!, $cursor: String) {
    organization(login: $organization) {
      name
      url
      repository(name: $repository) {
        id
        name
        url
        viewerHasStarred
        stargazers {
          totalCount
        }
        issues(first: 5, after: $cursor, states:[OPEN]) {
          totalCount
          pageInfo {
            endCursor
            hasNextPage
          }
          edges {
            node {
              id
              title
              url
              state
              reactions(last: 3) {
                edges {
                  node {
                    id
                    content
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

/**
 *
 * @param {String} path The path to the organization's repository in the format <org>/<repo>
 * @param {String} cursor The issue cursor to fetch issues after
 */
export const getIssuesOfRepository = (path, cursor) => {
  const [organization, repository] = path.split("/");
  return axiosGitHubGraphQL.post("", {
    query: GET_ISSUES_OF_REPOSITORY,
    variables: { organization, repository, cursor }
  });
};

const ADD_STAR = `
  mutation ($repositoryId: ID!) {
    addStar(input: {starrableId: $repositoryId}) {
      starrable {
        viewerHasStarred  
        stargazers {
          totalCount
        }
      }
    }
  }
`;

export const addStarToRepository = repositoryId => {
  return axiosGitHubGraphQL.post("", {
    query: ADD_STAR,
    variables: { repositoryId }
  });
};

const REMOVE_STAR = `
  mutation ($repositoryId: ID!) {
    removeStar (input: {starrableId: $repositoryId}) {
      starrable {
        viewerHasStarred,
        stargazers {
          totalCount
        }
      }
    }
  }
`;

export const removeStarFromRepository = repositoryId => {
  return axiosGitHubGraphQL.post("", {
    query: REMOVE_STAR,
    variables: { repositoryId }
  });
};
