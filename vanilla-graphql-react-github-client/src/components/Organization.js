import React from "react";
import PropTypes from "prop-types";

import Repository from "./Repository";

const Organization = ({
  organization,
  errors,
  fetchMoreIssues,
  starRepository
}) => (
  <div>
    <p>
      <strong>Issues for organization: </strong>
      <a href={organization.url}>{organization.name}</a>
    </p>
    <Repository
      repository={organization.repository}
      fetchMoreIssues={fetchMoreIssues}
      starRepository={starRepository}
    />
  </div>
);

Organization.propTypes = {
  organization: PropTypes.shape({
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    repository: Repository.propTypes.repository
  }),
  fetchMoreIssues: PropTypes.func.isRequired,
  starRepository: PropTypes.func.isRequired
};

export default Organization;
