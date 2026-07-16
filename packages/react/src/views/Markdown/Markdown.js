import React, { useMemo, useContext } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { Box } from '@embeddedchat/ui-elements';
import { Markup, MarkupInteractionContext } from '@embeddedchat/markups/src';
import EmojiReaction from '../EmojiReaction/EmojiReaction';
import { useMemberStore, useUserStore } from '../../store';
import useSetExclusiveState from '../../hooks/useSetExclusiveState';
import RCContext from '../../context/RCInstance';

const Markdown = ({ body, md, isReaction = false }) => {
  const members = useMemberStore((state) => state.members);
  const username = useUserStore((state) => state.username);
  
  const { RCInstance } = useContext(RCContext);
  const setExclusiveState = useSetExclusiveState();
  const { setShowCurrentUserInfo, setCurrentUser } = useUserStore((state) => ({
    setShowCurrentUserInfo: state.setShowCurrentUserInfo,
    setCurrentUser: state.setCurrentUser,
  }));

  const handleUserInfo = async (uname) => {
    const data = await RCInstance.userData(uname);
    setCurrentUser({
      _id: data.user._id,
      username: data.user.username,
      name: data.user.name,
    });
    setExclusiveState(setShowCurrentUserInfo);
  };

  const value = useMemo(
    () => ({ members, username, onUserClick: handleUserInfo }),
    [members, username, RCInstance, setShowCurrentUserInfo, setCurrentUser, setExclusiveState]
  );

  if (isReaction) {
    return (
      <Box
        css={css`
          font-size: 1rem;
        `}
      >
        <EmojiReaction body={body} />
      </Box>
    );
  }

  if (!body || !md) return <></>;

  return (
    <Box>
      <MarkupInteractionContext.Provider value={value}>
        <Markup tokens={md} />
      </MarkupInteractionContext.Provider>
    </Box>
  );
};

Markdown.propTypes = {
  body: PropTypes.any,
  isReaction: PropTypes.bool,
};

export default Markdown;
