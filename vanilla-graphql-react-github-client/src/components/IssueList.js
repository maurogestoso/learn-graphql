import React from "react";
import PropTypes from "prop-types";

import ReactionList from "./ReactionList";

export const IssueItem = ({ issue }) => (
  <li>
    <a href={issue.url}>{issue.title}</a>{" "}
    <span
      style={{
        backgroundColor: issue.state === "OPEN" ? "green" : "red",
        color: "white"
      }}
    >
      {issue.state}
    </span>
    <ReactionList reactions={issue.reactions} />
  </li>
);

IssueItem.propTypes = {
  issue: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  })
};

const IssueList = ({ issues }) => (
  <ul>
    {issues.edges.map(({ node }) => (
      <IssueItem key={node.id} issue={node} />
    ))}
  </ul>
);

IssueList.propTypes = {
  issues: PropTypes.shape({
    edges: PropTypes.arrayOf(
      PropTypes.shape({ node: IssueItem.propTypes.issue })
    )
  })
};

export default IssueList;
