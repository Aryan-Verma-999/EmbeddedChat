import { EmbeddedChat } from '..';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
export default {
  title: 'EmbeddedChat/Simple',
  component: EmbeddedChat,
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Simple = {
  args: {
    host: process.env.STORYBOOK_RC_HOST || 'http://10.78.19.46:3000',
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
  },
};
