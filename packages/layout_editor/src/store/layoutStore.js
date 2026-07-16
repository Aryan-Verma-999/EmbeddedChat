import { create } from 'zustand';
import initialMessages from '../data/messages.json';

const useLayoutStore = create((set) => ({
  themeLabOpen: false,
  setThemeLabOpen: (themeLabOpen) => {
    set({ themeLabOpen });
  },

  messageView: 'flat',
  setMessageView: (messageView) => {
    set({ messageView });
  },

  displayName: 'normal',
  setDisplayName: (displayName) => {
    set({ displayName });
  },

  sidebarWidth: '350px',
  setSidebarWidth: (sidebarWidth) => {
    set({ sidebarWidth });
  },

  messages: initialMessages,
  setMessages: (messages) => {
    set({ messages });
  },
  addMessage: (msg) => {
    set((state) => ({ messages: [msg, ...state.messages] }));
  },
}));

export default useLayoutStore;
