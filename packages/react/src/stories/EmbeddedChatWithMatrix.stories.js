import { EmbeddedChat } from '..';

export default {
  title: 'EmbeddedChat/WithMatrix',
  component: EmbeddedChat,
};

export const WithMatrix = {
  args: {
    host: process.env.STORYBOOK_RC_HOST || 'https://rc.aryanverma.dev',
    roomId: process.env.RC_ROOM_ID || '69bc5fb1ea3e60ec913c3a9c',
    channelName: 'general',
    anonymousMode: false,
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
