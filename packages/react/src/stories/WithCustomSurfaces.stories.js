import { EmbeddedChat } from '..';

export default {
  title: 'EmbeddedChat/WithCustomSurfaces',
  component: EmbeddedChat,
};

export const CustomContextualBar = {
  args: {
    host: process.env.STORYBOOK_RC_HOST || 'http://localhost:3000',
    roomId: process.env.RC_ROOM_ID || 'GENERAL',
    channelName: 'general',
    anonymousMode: false,
    headerColor: 'white',
    toastBarPosition: 'bottom right',
    showRoles: true,
    enableThreads: true,
    hideHeader: false,
    auth: {
      flow: 'PASSWORD',
    },
    dark: false,
    customSurfaces: {
      contextualBar: [
        {
          type: 'section',
          text: {
            type: 'plain_text',
            text: 'Test Custom Contextual Bar Input',
          },
          accessory: null,
        },
        {
          type: 'input',
          element: {
            type: 'plain_text_input',
            actionId: 'custom-input-action',
            placeholder: {
              type: 'plain_text',
              text: 'Type something here...',
            },
          },
          label: {
            type: 'plain_text',
            text: 'Custom Input Label',
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              actionId: 'custom-btn-action',
              text: {
                type: 'plain_text',
                text: 'Click Me',
              },
              value: 'click-value',
            },
          ],
        },
      ],
      onAction: (action) => {
        console.log(
          'Storybook customSurfaces.onAction received action:',
          action
        );
      },
    },
  },
};
