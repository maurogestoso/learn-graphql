import React from "react";

import RepositoryItem from "./RepositoryItem";

const RepositoryList = ({ repositories }) => {
  return repositories.edges.map(({ node }) => (
    <RepositoryItem key={node.id} {...node} />
  ));
};

export default RepositoryList;
