const hexToHsl = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!result) return null;
  const r = parseInt(result[1], 16) / 255;
  const g = parseInt(result[2], 16) / 255;
  const b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h;
  let s;
  const l = (max + min) / 2;

  if (max === min) {
    h = 0;
    s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      default:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
};

const hsl = (h, s, l) => `hsl(${h}, ${s}%, ${l}%)`;

/**
 * Generate a full EmbeddedChat theme from a seed color.
 *
 * @param {string} primaryHex  - Primary/brand hex color e.g. "#f59e0b"
 * @param {object} baseTheme   - The base theme to merge/inherit from
 * @param {object} options
 * @param {string|null} options.radius      - Border-radius token e.g. "0.5rem"
 * @param {string|null} options.accentHex   - Optional second accent hex color
 * @param {string|null} options.fontFamily  - Optional font-family override
 */
const generateThemeFromColor = (primaryHex, baseTheme, options = {}) => {
  const { radius = null, accentHex = null, fontFamily = null } = options;

  const primary = hexToHsl(primaryHex);
  if (!primary) return null;

  const accent = accentHex ? hexToHsl(accentHex) : null;

  const pH = primary.h;
  const pS = primary.s;
  const aH = accent ? accent.h : (pH + 30) % 360;
  const aS = accent ? accent.s : Math.max(pS, 60);

  const lightScheme = {
    background: hsl(pH, Math.min(pS, 15), 99),
    foreground: hsl(pH, Math.min(pS, 20), 8),
    card: hsl(pH, Math.min(pS, 15), 97),
    cardForeground: hsl(pH, Math.min(pS, 20), 8),
    popover: hsl(pH, Math.min(pS, 10), 100),
    popoverForeground: hsl(pH, Math.min(pS, 20), 8),
    primary: hsl(pH, Math.max(pS, 70), 45),
    primaryForeground: hsl(0, 0, 100),
    secondary: hsl(pH, Math.min(pS, 30), 93),
    secondaryForeground: hsl(pH, Math.min(pS, 40), 25),
    muted: hsl(pH, Math.min(pS, 15), 94),
    mutedForeground: hsl(pH, Math.min(pS, 10), 46),
    accent: hsl(aH, Math.min(aS, 40), 90),
    accentForeground: hsl(aH, Math.max(aS, 50), 28),
    destructive: hsl(0, 84, 60),
    destructiveForeground: hsl(0, 0, 100),
    border: hsl(pH, Math.min(pS, 20), 89),
    input: hsl(pH, Math.min(pS, 20), 89),
    ring: hsl(pH, Math.max(pS, 70), 45),
    warning: hsl(38, 92, 50),
    warningForeground: hsl(48, 96, 89),
    success: hsl(142, 70, 40),
    successForeground: hsl(0, 0, 100),
    info: hsl(214, 76, 50),
    infoForeground: hsl(214, 78, 93),
  };

  const darkScheme = {
    background: hsl(pH, Math.min(pS, 18), 9),
    foreground: hsl(pH, Math.min(pS, 15), 93),
    card: hsl(pH, Math.min(pS, 15), 13),
    cardForeground: hsl(pH, Math.min(pS, 15), 93),
    popover: hsl(pH, Math.min(pS, 15), 13),
    popoverForeground: hsl(pH, Math.min(pS, 15), 93),
    primary: hsl(pH, Math.max(pS, 70), 62),
    primaryForeground: hsl(0, 0, 100),
    secondary: hsl(pH, Math.min(pS, 25), 20),
    secondaryForeground: hsl(pH, Math.min(pS, 40), 80),
    muted: hsl(pH, Math.min(pS, 15), 17),
    mutedForeground: hsl(pH, Math.min(pS, 10), 52),
    accent: hsl(aH, Math.min(aS, 35), 22),
    accentForeground: hsl(aH, Math.min(aS, 50), 80),
    destructive: hsl(0, 62, 38),
    destructiveForeground: hsl(0, 0, 96),
    border: hsl(pH, Math.min(pS, 18), 20),
    input: hsl(pH, Math.min(pS, 18), 20),
    ring: hsl(pH, Math.max(pS, 70), 62),
    warning: hsl(48, 96, 89),
    warningForeground: hsl(38, 92, 50),
    success: hsl(142, 60, 35),
    successForeground: hsl(0, 0, 96),
    info: hsl(214, 78, 93),
    infoForeground: hsl(214, 75, 20),
  };

  const typography = fontFamily
    ? {
        ...baseTheme.typography,
        default: {
          ...baseTheme.typography?.default,
          fontFamily: `'${fontFamily}', ${
            baseTheme.typography?.default?.fontFamily ?? 'sans-serif'
          }`,
        },
      }
    : baseTheme.typography;

  return {
    ...baseTheme,
    radius: radius ?? baseTheme.radius,
    typography,
    schemes: { light: lightScheme, dark: darkScheme },
  };
};

export default generateThemeFromColor;
