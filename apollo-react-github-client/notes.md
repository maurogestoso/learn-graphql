- [Setup](#setup)
  - [Dependencies](#dependencies)
  - [Connecting Apollo to React](#connecting-apollo-to-react)
- [Querying Data](#querying-data)
- [Error Handling](#error-handling)

## Setup

### Dependencies

```
npm i apollo-client apollo-cache-inmemory apollo-link-http
npm i graphql graphql-tag
npm i react-apollo
```

### Connecting Apollo to React

```js
const GITHUB_BASE_URL = "https://api.github.com/graphql";
const httpLink = new HttpLink({
  uri: GITHUB_BASE_URL,
  headers: {
    authorization: `Bearer ${
      process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN
    }`
  }
});
const cache = new InMemoryCache();
const client = new ApolloClient({
  link: httpLink,
  cache
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
```

## Querying Data

The `Query` component allows you to declaratively connect a React component to a GraphQL query. It accepts a prop with the query and a render prop.

```js
import { Query } from "react-apollo";
import gql from "graphql-tag";

const GET_VIEWER = gql`
  {
    viewer {
      name
      login
    }
  }
`;

const Profile = () => (
  <Query query={GET_VIEWER}>
    {({ data, errors, loading }) => {
      const { viewer } = data;
      return (
        <div>
          <h2>
            {viewer.name} {viewer.login}
          </h2>
        </div>
      );
    }}
  </Query>
);
```

## Error Handling

Error handling with Apollo can be done at query level and at app leve.

At query level, the render prop of the `Query` component passes an `errors` prop down that can be used in your own components.

At app level, you can use `apollo-link-error` to catch all GraphQL and network errors that happen under a certain `ApolloProvider`. You can think of apollo links as middleware for when Apollo makes a request.

In the following example, we hook into GraphQL errors that happen app-wide and log them:

```js
import { onError } from "apollo-link-error";

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.log(graphQLErrors);
  }
});

const httpLink = new HttpLink({
  uri: GITHUB_BASE_URL,
  headers: {
    authorization: `Bearer ${
      process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN
    }`
  }
});

const link = ApolloLink.from([errorLink, httpLink]);

const cache = new InMemoryCache();

const client = new ApolloClient({
  link,
  cache
});
```

## HOC instead of render props

The render props pattern to connect queries/mutations to React components is recommended by the Apollo team. But if you prefer HOCs, `react-apollo` exports `graphql` for this purpose:

```js
import { graphql } from "react-apollo";

const Profile = ({ data, error, loading }) => {
  if (error) {
    return <ErrorMessage error={error} />;
  }

  const { viewer } = data;

  if (loading || !viewer) {
    return <Loading />;
  }

  return (
    <div>
      {viewer.name} {viewer.login}
      <RepositoryList repositories={viewer.repositories} />
    </div>
  );
};

export default graphql(GET_REPOSITORIES_OF_CURRENT_USER)(Profile);
```
