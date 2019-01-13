import React from "react";
import PropTypes from "prop-types";

export const ReactionItem = ({ reaction }) => <li>{reaction.content}</li>;

ReactionItem.propTypes = {
  reaction: PropTypes.shape({
    id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired
  })
};

const ReactionList = ({ reactions }) => (
  <ul>
    {reactions.edges.map(({ node }) => (
      <ReactionItem key={node.id} reaction={node} />
    ))}
  </ul>
);

ReactionList.propTypes = {
  reactions: PropTypes.shape({
    edges: PropTypes.arrayOf(
      PropTypes.shape({ node: ReactionItem.propTypes.reaction })
    )
  })
};

export default ReactionList;
