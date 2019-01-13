import gql from "graphql-tag";

export const STAR_REPOSITORY = gql`
  mutation($repositoryId: ID!) {
    addStar(input: { starrableId: $repositoryId }) {
      starrable {
        id
        stargazers {
          totalCount
        }
        viewerHasStarred
      }
    }
  }
`;

export const UNSTAR_REPOSITORY = gql`
  mutation($repositoryId: ID!) {
    removeStar(input: { starrableId: $repositoryId }) {
      starrable {
        id
        stargazers {
          totalCount
        }
        viewerHasStarred
      }
    }
  }
`;

export const UPDATE_REPOSITORY_SUBSCRIPTION = gql`
  mutation($repositoryId: ID!, $subscriptionState: SubscriptionState!) {
    updateSubscription(
      input: { subscribableId: $repositoryId, state: $subscriptionState }
    ) {
      subscribable {
        id
        viewerSubscription
      }
    }
  }
`;
