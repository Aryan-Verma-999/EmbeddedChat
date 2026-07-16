import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Box, Tooltip } from '@embeddedchat/ui-elements';
import { MarkupInteractionContext } from '../MarkupInteractionContext';
import useMentionStyles from '../elements/elements.styles';

const UserMention = ({ contents }) => {
  const { members, username, onUserClick } = useContext(MarkupInteractionContext);

  const hasMember = (user) => {
    if (user === 'all' || user === 'here') {
      return true;
    }
    let found = false;
    Object.keys(members).forEach((ele) => {
      if (members[ele].username === user) {
        found = true;
      }
    });
    return found;
  };

  const styles = useMentionStyles(contents, username);

  const handleClick = () => {
    if (!['here', 'all'].includes(contents.value) && onUserClick) {
      onUserClick(contents.value);
    }
  };

  const tooltipMap = {
    all: 'Mentions all the room members',
    here: 'Mentions online room members',
    [username]: 'Mentions you',
  };
  const tooltipText = tooltipMap[contents.value] || 'Mentions user';

  return (
    <>
      {hasMember(contents.value) ? (
        <Tooltip text={tooltipText} position="top" key={username}>
          <Box is="span" css={styles.mention} onClick={handleClick}>
            {contents.value}
          </Box>
        </Tooltip>
      ) : (
        `@${contents.value}`
      )}
    </>
  );
};

UserMention.propTypes = {
  contents: PropTypes.any.isRequired,
};

export default UserMention;
