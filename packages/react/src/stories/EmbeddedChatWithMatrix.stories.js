import { EmbeddedChat } from '..';

// Bypass localtunnel anti-phishing warning screen for the live demo
if (typeof window !== 'undefined') {
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    const [resource, config] = args;
    const newConfig = {
      ...config,
      headers: {
        ...(config?.headers || {}),
        'Bypass-Tunnel-Reminder': 'true',
      },
    };
    return originalFetch(resource, newConfig);
  };
}


// Story demonstrating EmbeddedChat with Matrix federation support
// Requires Rocket.Chat server v7.11+ with native federation enabled
export default {
  title: 'EmbeddedChat/WithMatrix',
  component: EmbeddedChat,
  parameters: {
    docs: {
      description: {
        component: `
## Matrix Federation Mode

This story demonstrates EmbeddedChat connected to a Rocket.Chat server with native Matrix federation enabled.

### Requirements
- Rocket.Chat server v7.11 or later
- Native federation enabled in RC admin settings
- A federated room (created with \`federated: true\` or containing remote Matrix users)

### Current Limitations (Beta)
- Public room discovery is not yet supported
- End-to-end encryption not available in federated rooms
- Voice/video calls disabled in federated rooms
- Matrix protocol version limited to v1.1

### Configuration
Set \`federationEnabled: true\` to enable federation UI features like the federation badge.
        `,
      },
    },
  },
};

// Standard federation mode with password authentication
export const WithMatrix = {
  args: {
    host: process.env.STORYBOOK_RC_HOST || 'http://10.78.19.46:3000',
    roomId: process.env.RC_ROOM_ID || 'GENERAL',
    channelName: 'general',
    federationEnabled: true,
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

// Federation mode with dark theme
export const WithMatrixDark = {
  args: {
    ...WithMatrix.args,
    dark: true,
  },
};

// Federation mode with custom room ID (for testing with actual federated rooms)
export const WithFederatedRoom = {
  args: {
    ...WithMatrix.args,
    roomId: process.env.RC_FEDERATED_ROOM_ID || 'GENERAL',
    channelName: 'federated-room',
  },
};
