import React, { useRef } from 'react';
import { css } from '@emotion/react';
import { Box, Input, ActionButton, useTheme } from '@embeddedchat/ui-elements';
import { getChatInputStyles } from './ChatInput.styles';
import ChatInputToolbar from './ChatInputToolbar';
import useLayoutStore from '../../store/layoutStore';

const ChatInput = () => {
  const styles = getChatInputStyles(useTheme());
  const addMessage = useLayoutStore((state) => state.addMessage);

  const inputRef = useRef(null);
  const messageRef = useRef(null);
  const chatInputContainer = useRef(null);

  const handleBlur = () => {
    if (chatInputContainer.current) {
      chatInputContainer.current.classList.remove('focused');
    }
  };

  const handleFocus = () => {
    if (chatInputContainer.current) {
      chatInputContainer.current.classList.add('focused');
    }
  };

  const handleSend = () => {
    const text = messageRef.current?.value || '';
    if (!text.trim()) return;

    const newMsg = {
      _id: Math.random().toString(36).substring(2, 15),
      rid: 'GENERAL',
      msg: text,
      ts: new Date().toISOString(),
      u: {
        _id: 'spiral_memory_id',
        username: 'spiral_memory',
        name: 'Zishan Ahmad',
      },
      _updatedAt: new Date().toISOString(),
      urls: [],
      mentions: [],
      channels: [],
      md: [
        {
          type: 'PARAGRAPH',
          value: [
            {
              type: 'PLAIN_TEXT',
              value: text,
            },
          ],
        },
      ],
    };

    addMessage(newMsg);
    if (messageRef.current) {
      messageRef.current.value = '';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box
      className="ec-chat-input"
      css={styles.inputWithFormattingBox}
      ref={chatInputContainer}
    >
      <Box ref={chatInputContainer}>
        <Box css={styles.inputBox}>
          <Input
            textArea
            rows={1}
            placeholder="Message"
            css={styles.textInput}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            ref={messageRef}
          />
          <input type="file" hidden ref={inputRef} />
          <Box
            css={css`
              padding: 0.25rem;
            `}
          >
            <ActionButton
              ghost
              size="large"
              onClick={handleSend}
              type="primary"
              icon="send"
            />
          </Box>
        </Box>
        <ChatInputToolbar messageRef={messageRef} inputRef={inputRef} />
      </Box>
    </Box>
  );
};

export default ChatInput;
