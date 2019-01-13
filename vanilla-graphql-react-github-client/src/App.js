import React, { Component } from "react";

import Organization from "./components/Organization";
import {
  getIssuesOfRepository,
  addStarToRepository,
  removeStarFromRepository
} from "./queries";

const resolveIssuesQuery = (queryResult, cursor) => state => {
  const { data, errors } = queryResult.data;

  if (!cursor) {
    return { organization: data.organization, errors };
  }

  const { edges: oldIssues } = state.organization.repository.issues;
  const { edges: newIssues } = data.organization.repository.issues;
  const updatedIssues = [...oldIssues, ...newIssues];

  return {
    organization: {
      ...data.organization,
      repository: {
        ...data.organization.repository,
        issues: {
          ...data.organization.repository.issues,
          edges: updatedIssues
        }
      }
    },
    errors
  };
};

const resolveAddStarQuery = queryResult => state => {
  const {
    viewerHasStarred,
    stargazers
  } = queryResult.data.data.addStar.starrable;
  return {
    ...state,
    organization: {
      ...state.organization,
      repository: {
        ...state.organization.repository,
        viewerHasStarred,
        stargazers: {
          ...state.organization.repository.stargazers,
          totalCount: stargazers.totalCount
        }
      }
    }
  };
};

const resolveRemoveStarQuery = queryResult => state => {
  const {
    viewerHasStarred,
    stargazers
  } = queryResult.data.data.removeStar.starrable;
  return {
    ...state,
    organization: {
      ...state.organization,
      repository: {
        ...state.organization.repository,
        viewerHasStarred,
        stargazers: {
          ...state.organization.repository.stargazers,
          totalCount: stargazers.totalCount
        }
      }
    }
  };
};

class App extends Component {
  state = {
    path: "the-road-to-learn-react/the-road-to-learn-react",
    organization: null,
    errors: null
  };

  componentDidMount = () => {
    this.fetchGitHubData(this.state.path);
  };

  fetchGitHubData = (path, cursor) => {
    return getIssuesOfRepository(path, cursor)
      .then(queryResult =>
        this.setState(resolveIssuesQuery(queryResult, cursor))
      )
      .catch(console.log);
  };

  submitForm = event => {
    event.preventDefault();

    this.fetchGitHubData(this.state.path);
  };

  updatePathField = event => {
    this.setState({ path: event.target.value });
  };

  fetchMoreIssues = () => {
    const { endCursor } = this.state.organization.repository.issues.pageInfo;
    this.fetchGitHubData(this.state.path, endCursor);
  };

  starRepository = (repositoryId, viewerHasStarred) => {
    return viewerHasStarred
      ? removeStarFromRepository(repositoryId).then(queryResult => {
          this.setState(resolveRemoveStarQuery(queryResult));
        })
      : addStarToRepository(repositoryId).then(queryResult => {
          this.setState(resolveAddStarQuery(queryResult));
        });
  };

  render() {
    const { path, organization, errors } = this.state;
    return (
      <div>
        <h1>GraphQL Client</h1>
        <form onSubmit={this.submitForm}>
          <label htmlFor="url">Show open issues for https://github.com/</label>
          <input
            id="url"
            type="text"
            onChange={this.updatePathField}
            style={{ width: 300 }}
            value={path}
          />
          <button type="submit">Search</button>
        </form>
        <hr />
        {organization ? (
          <Organization
            organization={organization}
            errors={errors}
            fetchMoreIssues={this.fetchMoreIssues}
            starRepository={this.starRepository}
          />
        ) : (
          <p>No information yet</p>
        )}
      </div>
    );
  }
}

export default App;
