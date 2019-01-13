import React from "react";
import PropTypes from "prop-types";

import IssueList from "./IssueList";

const Repository = ({ repository, fetchMoreIssues, starRepository }) => (
  <div>
    <p>
      <strong>In repository: </strong>
      <a href={repository.url}>{repository.name}</a>
    </p>
    <button
      onClick={() => starRepository(repository.id, repository.viewerHasStarred)}
    >
      {repository.viewerHasStarred ? "Unstar" : "Star"}{" "}
      {repository.stargazers.totalCount}
    </button>
    <IssueList issues={repository.issues} />
    <hr />
    {repository.issues.pageInfo.hasNextPage && (
      <button onClick={fetchMoreIssues}>More</button>
    )}
  </div>
);

Repository.propTypes = {
  repository: PropTypes.shape({
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    viewerHasStarred: PropTypes.bool.isRequired,
    issues: IssueList.propTypes.issues,
    stargazers: PropTypes.shape({
      totalCount: PropTypes.number.isRequired
    })
  }),
  fetchMoreIssues: PropTypes.func.isRequired,
  starRepository: PropTypes.func.isRequired
};

export default Repository;
