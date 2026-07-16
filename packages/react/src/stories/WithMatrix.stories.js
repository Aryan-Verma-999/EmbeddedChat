import { EmbeddedChat } from '..';

export default {
  title: 'EmbeddedChat/WithMatrix',
  component: EmbeddedChat,
};

/**
 * WithMatrix — GSoC demonstration story.
 *
 * Showcases:
 *  - MatrixTheme (Element-inspired emerald green + charcoal dark palette)
 *  - layoutMode="timeline" flat, bubble-less message layout
 *  - Federated room detection with server origin badges on messages
 *  - Matrix federation badge in the chat header
 *
 * Requires:
 *  - unpatched.aryanverma.dev running with the license bypass patches applied
 *  - A federated room whose Rocket.Chat internal _id is set as roomId
 */
export const WithMatrix = {
  args: {
    host: 'https://unpatched.aryanverma.dev',
    roomId: 'GENERAL',
    channelName: 'general',
    anonymousMode: false,
    toastBarPosition: 'bottom right',
    showRoles: true,
    showAvatar: true,
    showName: true,
    showUsername: true,
    enableThreads: true,
    hideHeader: false,
    auth: {
      flow: 'PASSWORD',
    },
    // Enable the Matrix/Element dark theme
    theme: 'matrix',
    dark: true,
    // Flat timeline layout (no message bubbles)
    layoutMode: 'timeline',
  },
};
