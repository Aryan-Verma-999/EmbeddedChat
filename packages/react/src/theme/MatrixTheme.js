/**
 * MatrixTheme — Element/Matrix-inspired theme for EmbeddedChat.
 *
 * Color reference (Element Web):
 *   Primary green  : #0dbd8b  →  hsl(163, 88%, 40%)
 *   Dark background: #15191e  →  hsl(216, 17%, 10%)
 *   Dark sidebar   : #21262d  →  hsl(213, 15%, 15%)
 *   Dark card      : #2c3038  →  hsl(220, 12%, 20%)
 *   Dark border    : #394049  →  hsl(215, 11%, 25%)
 *   Light bg       : #ffffff
 *   Light card     : #f2f5f8  →  hsl(210, 25%, 97%)
 *   Light border   : #e3e8f0  →  hsl(215, 30%, 91%)
 *   Light muted fg : #737d8c  →  hsl(213, 10%, 56%)
 *   Dark muted fg  : #8e99a4  →  hsl(205, 10%, 60%)
 */
const MatrixTheme = {
  radius: '0.4rem',

  commonColors: {
    black: 'hsl(0, 0%, 0%)',
    white: 'hsl(0, 0%, 100%)',
  },

  schemes: {
    light: {
      /* ── Layout ── */
      background: 'hsl(0, 0%, 100%)', // #ffffff — pure white
      foreground: 'hsl(216, 17%, 10%)', // #15191e — near-black text

      /* ── Card / Popover ── */
      card: 'hsl(210, 25%, 97%)', // #f2f5f8 — soft off-white
      cardForeground: 'hsl(216, 17%, 10%)',
      popover: 'hsl(0, 0%, 100%)',
      popoverForeground: 'hsl(216, 17%, 10%)',

      /* ── Brand ── */
      primary: 'hsl(163, 88%, 40%)', // #0dbd8b — Element green
      primaryForeground: 'hsl(0, 0%, 100%)',

      /* ── Secondary ── */
      secondary: 'hsl(163, 40%, 92%)', // light green tint
      secondaryForeground: 'hsl(163, 88%, 25%)',

      /* ── Muted ── */
      muted: 'hsl(210, 20%, 95%)',
      mutedForeground: 'hsl(213, 10%, 56%)', // #737d8c

      /* ── Accent ── */
      accent: 'hsl(163, 50%, 90%)', // pale emerald accent
      accentForeground: 'hsl(163, 88%, 28%)',

      /* ── States ── */
      destructive: 'hsl(0, 84%, 60%)',
      destructiveForeground: 'hsl(0, 0%, 100%)',
      warning: 'hsl(38, 92%, 50%)',
      warningForeground: 'hsl(48, 96%, 89%)',
      success: 'hsl(163, 88%, 40%)', // reuse Element green for success
      successForeground: 'hsl(0, 0%, 100%)',
      info: 'hsl(204, 70%, 50%)',
      infoForeground: 'hsl(204, 78%, 93%)',

      /* ── Input / Focus ── */
      border: 'hsl(215, 30%, 91%)', // #e3e8f0
      input: 'hsl(215, 30%, 91%)',
      ring: 'hsl(163, 88%, 40%)', // green focus ring
    },

    dark: {
      /* ── Layout ── */
      background: 'hsl(216, 17%, 10%)', // #15191e — Element dark bg
      foreground: 'hsl(0, 0%, 96%)', // near-white text

      /* ── Card / Popover ── */
      card: 'hsl(220, 12%, 20%)', // #2c3038 — message bubble bg
      cardForeground: 'hsl(0, 0%, 96%)',
      popover: 'hsl(213, 15%, 15%)', // #21262d — sidebar tone
      popoverForeground: 'hsl(0, 0%, 96%)',

      /* ── Brand ── */
      primary: 'hsl(163, 88%, 40%)', // #0dbd8b — same green in dark
      primaryForeground: 'hsl(0, 0%, 100%)',

      /* ── Secondary ── */
      secondary: 'hsl(213, 15%, 15%)', // #21262d — secondary surfaces
      secondaryForeground: 'hsl(163, 70%, 70%)', // muted green text on secondary

      /* ── Muted ── */
      muted: 'hsl(220, 12%, 20%)', // #2c3038
      mutedForeground: 'hsl(205, 10%, 60%)', // #8e99a4

      /* ── Accent ── */
      accent: 'hsl(163, 40%, 18%)', // dark green tint for hover
      accentForeground: 'hsl(163, 88%, 70%)',

      /* ── States ── */
      destructive: 'hsl(0, 62%, 40%)',
      destructiveForeground: 'hsl(0, 0%, 96%)',
      warning: 'hsl(48, 96%, 89%)',
      warningForeground: 'hsl(38, 92%, 50%)',
      success: 'hsl(163, 88%, 40%)',
      successForeground: 'hsl(0, 0%, 100%)',
      info: 'hsl(214, 78%, 93%)',
      infoForeground: 'hsl(214, 75%, 20%)',

      /* ── Input / Focus ── */
      border: 'hsl(215, 11%, 25%)', // #394049
      input: 'hsl(215, 11%, 25%)',
      ring: 'hsl(163, 88%, 40%)', // green focus ring in dark
    },
  },

  typography: {
    default: {
      fontFamily:
        "Inter, 'Helvetica Neue', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
      fontSize: 15,
      fontWeightRegular: 400,
    },
    h1: { fontSize: '1.8rem', fontWeight: 700 },
    h2: { fontSize: '1.4rem', fontWeight: 600 },
    h3: { fontSize: '1.2rem', fontWeight: 600 },
    h4: { fontSize: '1rem', fontWeight: 500 },
    h5: { fontSize: '0.875rem', fontWeight: 400 },
    h6: { fontSize: '0.75rem', fontWeight: 500 },
  },

  shadows: [
    'none',
    '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    '0 8px 32px rgba(0, 0, 0, 0.32)',
  ],
};

export default MatrixTheme;
