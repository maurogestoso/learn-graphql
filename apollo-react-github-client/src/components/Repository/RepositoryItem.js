import React from "react";
import { Mutation } from "react-apollo";

import {
  STAR_REPOSITORY,
  UNSTAR_REPOSITORY,
  UPDATE_REPOSITORY_SUBSCRIPTION
} from "./mutations";
import { REPOSITORY_FRAGMENT } from "./fragments";
import ButtonWithCounter from "../ButtonWithCounter";
import Link from "../Link";

import "./RepositoryItem.css";

const getNewSubscriptionState = currentState =>
  ({
    SUBSCRIBED: "UNSUBSCRIBED",
    UNSUBSCRIBED: "SUBSCRIBED"
  }[currentState]);

const getSubscriptionActionLabel = currentState =>
  ({
    SUBSCRIBED: "Unwatch",
    UNSUBSCRIBED: "Watch"
  }[currentState]);

const updateSubscriptionState = (client, { data }) => {
  const { id, viewerSubscription } = data.updateSubscription.subscribable;

  // Read cached repository data
  const repository = client.readFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT
  });

  // Calculate new watchers totalCount
  let { totalCount } = repository.watchers;
  totalCount =
    viewerSubscription === "SUBSCRIBED" ? totalCount + 1 : totalCount - 1;

  // Update totalCount
  client.writeFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
    data: {
      ...repository,
      watchers: {
        ...repository.watchers,
        totalCount
      }
    }
  });
};

const RepositoryItem = ({
  descriptionHTML,
  id,
  name,
  owner,
  primaryLanguage,
  stargazers,
  url,
  viewerHasStarred,
  viewerSubscription,
  watchers
}) => (
  <div className="RepositoryItem">
    <h3>
      <Link href={url}>{name}</Link>
    </h3>

    <div className="controls">
      {/* Star/Unstar Button */}
      <React.Fragment>
        {viewerHasStarred ? (
          <Mutation
            mutation={UNSTAR_REPOSITORY}
            variables={{ repositoryId: id }}
          >
            {removeStar => (
              <ButtonWithCounter
                count={stargazers.totalCount}
                onClick={removeStar}
              >
                Unstar
              </ButtonWithCounter>
            )}
          </Mutation>
        ) : (
          <Mutation mutation={STAR_REPOSITORY} variables={{ repositoryId: id }}>
            {addStar => (
              <ButtonWithCounter
                count={stargazers.totalCount}
                onClick={addStar}
              >
                Star
              </ButtonWithCounter>
            )}
          </Mutation>
        )}
      </React.Fragment>

      {/* Watch/Unwatch Button */}
      <Mutation
        mutation={UPDATE_REPOSITORY_SUBSCRIPTION}
        variables={{
          repositoryId: id,
          subscriptionState: getNewSubscriptionState(viewerSubscription)
        }}
        update={updateSubscriptionState}
      >
        {updateSubscription => (
          <ButtonWithCounter
            count={watchers.totalCount}
            onClick={updateSubscription}
          >
            {getSubscriptionActionLabel(viewerSubscription)}
          </ButtonWithCounter>
        )}
      </Mutation>
    </div>

    <p dangerouslySetInnerHTML={{ __html: descriptionHTML }} />
    <p>
      <strong>Owner:</strong> <Link href={owner.url}>{owner.login}</Link>
    </p>
    <p>
      <strong>Primary Language:</strong> {primaryLanguage.name}
    </p>
  </div>
);

export default RepositoryItem;
