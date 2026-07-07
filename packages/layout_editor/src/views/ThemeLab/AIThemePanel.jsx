import React, { useState, useCallback, useRef } from 'react';
import { Box, useTheme, useToastBarDispatch } from '@embeddedchat/ui-elements';
import generateThemeFromColor from '../../lib/generateThemeFromColor';
import injectGoogleFont from '../../lib/injectGoogleFont';
import { getAIThemePanelStyles } from './AIThemePanel.styles';

// ─── Named color fallbacks ─────────────────────────────────────────────────────
const NAMED_COLORS = {
  red: '#ef4444',
  orange: '#f97316',
  amber: '#f59e0b',
  yellow: '#eab308',
  green: '#22c55e',
  teal: '#14b8a6',
  cyan: '#06b6d4',
  blue: '#3b82f6',
  indigo: '#6366f1',
  violet: '#8b5cf6',
  purple: '#a855f7',
  pink: '#ec4899',
  rose: '#f43f5e',
  slate: '#64748b',
  gray: '#6b7280',
  black: '#0f172a',
  white: '#f8fafc',
};

// ─── Font keyword map ──────────────────────────────────────────────────────────
const FONT_MAP = {
  professional: 'Inter',
  corporate: 'Inter',
  tech: 'JetBrains Mono',
  developer: 'JetBrains Mono',
  monospace: 'JetBrains Mono',
  editorial: 'Merriweather',
  serif: 'Merriweather',
  playful: 'Poppins',
  friendly: 'Poppins',
  modern: 'Plus Jakarta Sans',
  minimal: 'DM Sans',
  geometric: 'DM Sans',
  bold: 'Sora',
};

// ─── Parsers ───────────────────────────────────────────────────────────────────
const extractTwoHexColors = (raw) => {
  const matches = raw.match(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g);
  if (matches && matches.length >= 2) return [matches[0], matches[1]];
  if (matches && matches.length === 1) return [matches[0], null];
  const words = raw
    .toLowerCase()
    .replace(/[^a-z\s,]/g, '')
    .split(/[\s,]+/);
  const found = words.map((w) => NAMED_COLORS[w]).filter(Boolean);
  return [found[0] ?? null, found[1] ?? null];
};

const extractRadius = (prompt) => {
  const p = prompt.toLowerCase();
  if (/\b(pill|very rounded|fully rounded|circular)\b/.test(p)) return '1.5rem';
  if (/\b(rounded|round)\b/.test(p)) return '0.5rem';
  if (/\b(slightly rounded|subtle|soft corners?)\b/.test(p)) return '0.25rem';
  if (/\b(sharp|flat|square|squared|angular|no radius)\b/.test(p))
    return '0rem';
  return null;
};

const extractDarkMode = (prompt) => {
  const p = prompt.toLowerCase();
  if (/\b(dark mode|dark theme|dark|night)\b/.test(p)) return true;
  if (/\b(light mode|light theme|light|bright|day)\b/.test(p)) return false;
  return null;
};

const extractFontFamily = (prompt) => {
  const p = prompt.toLowerCase();
  return (
    Object.entries(FONT_MAP).find(([keyword]) =>
      new RegExp(`\\b${keyword}\\b`).test(p)
    )?.[1] ?? null
  );
};

// ─── Ollama call ───────────────────────────────────────────────────────────────
const askOllama = async (baseUrl, model, prompt) => {
  const url = `${baseUrl.replace(/\/$/, '')}/api/generate`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, prompt, stream: false }),
  });
  if (!res.ok) throw new Error(`Ollama ${res.status}: ${res.statusText}`);
  const data = await res.json();
  return data.response ?? '';
};

const SWATCH_KEYS = [
  { key: 'background', label: 'Background' },
  { key: 'card', label: 'Card' },
  { key: 'primary', label: 'Primary' },
  { key: 'secondary', label: 'Secondary' },
  { key: 'accent', label: 'Accent' },
  { key: 'muted', label: 'Muted' },
  { key: 'border', label: 'Border' },
  { key: 'foreground', label: 'Text' },
];

// ─── Component ─────────────────────────────────────────────────────────────────
const AIThemePanel = () => {
  const { theme, mode, setTheme, setMode } = useTheme();
  const styles = getAIThemePanelStyles(theme);
  const dispatchToastMessage = useToastBarDispatch();

  const [open, setOpen] = useState(false);
  const [baseUrl, setBaseUrl] = useState('http://localhost:11434');
  const [modelName, setModelName] = useState('qwen2.5:3b');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [appliedScheme, setAppliedScheme] = useState(null);
  const originalThemeRef = useRef(null);

  const buildPrompt = (userPrompt) =>
    `You are a color picker. Based on this description, return EXACTLY TWO hex color codes separated by a comma:
1. Primary/brand color
2. Accent/secondary color
Return ONLY the two hex codes like: #3b82f6, #f59e0b — no explanation.
Description: "${userPrompt}"`;

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || isGenerating) return;
    if (!originalThemeRef.current) originalThemeRef.current = theme;
    setIsGenerating(true);
    try {
      const aiResponse = await askOllama(
        baseUrl,
        modelName,
        buildPrompt(prompt)
      );
      const [primaryHex, accentHex] = extractTwoHexColors(aiResponse);
      if (!primaryHex) throw new Error('No color found in AI response');

      const radius = extractRadius(prompt);
      const isDark = extractDarkMode(prompt);
      const fontFamily = extractFontFamily(prompt);

      if (fontFamily) injectGoogleFont(fontFamily);

      const newTheme = generateThemeFromColor(primaryHex, theme, {
        radius,
        accentHex,
        fontFamily,
      });
      if (!newTheme) throw new Error('Theme generation failed');

      setTheme(newTheme);
      if (isDark !== null) setMode(isDark ? 'dark' : 'light');

      setAppliedScheme(newTheme.schemes[isDark ? 'dark' : mode]);

      const parts = [primaryHex];
      if (accentHex) parts.push(`accent ${accentHex}`);
      if (radius !== null) parts.push(radius);
      if (fontFamily) parts.push(fontFamily);

      dispatchToastMessage({
        type: 'success',
        message: `AI theme applied — ${parts.join(' · ')}`,
      });
    } catch (e) {
      console.error('[AI Theme Panel]', e);
      dispatchToastMessage({
        type: 'error',
        message: `Generation failed: ${e.message}`,
      });
    } finally {
      setIsGenerating(false);
    }
  }, [
    prompt,
    baseUrl,
    modelName,
    isGenerating,
    theme,
    mode,
    setTheme,
    setMode,
  ]);

  const handleReset = useCallback(() => {
    if (originalThemeRef.current) {
      setTheme(originalThemeRef.current);
      originalThemeRef.current = null;
    }
    setAppliedScheme(null);
    dispatchToastMessage({ type: 'success', message: 'Theme reset.' });
  }, [setTheme]);

  const currentScheme = appliedScheme ?? null;

  return (
    <Box css={styles.panel}>
      {/* ── Header / Toggle ── */}
      <Box
        css={styles.header}
        onClick={() => setOpen((o) => !o)}
        role="button"
        aria-expanded={open}
      >
        <Box css={styles.headerTitle}>
          <span>✦</span>
          <span>AI Theme Generator</span>
          <span css={styles.badge}>NEW</span>
        </Box>
        <span>{open ? '▲' : '▼'}</span>
      </Box>

      {/* ── Body ── */}
      {open && (
        <Box css={styles.body}>
          {/* Ollama URL */}
          <Box>
            <span css={styles.fieldLabel}>Ollama base URL</span>
            <input
              css={styles.input}
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="http://localhost:11434"
              aria-label="Ollama base URL"
            />
          </Box>

          {/* Model */}
          <Box>
            <span css={styles.fieldLabel}>Model</span>
            <input
              css={styles.input}
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="qwen2.5:3b"
              aria-label="Model name"
            />
          </Box>

          {/* Prompt */}
          <Box>
            <span css={styles.fieldLabel}>Describe your theme</span>
            <textarea
              css={styles.textarea}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder='e.g. "warm amber and violet accent, rounded, dark, minimal font"'
              rows={3}
              aria-label="Theme description"
            />
            <p css={styles.hint}>
              Mention a primary color, accent color, corner style (sharp /
              rounded / pill), mode (dark / light), and font style (minimal,
              tech, editorial…).
            </p>
          </Box>

          {/* Swatches */}
          {currentScheme && (
            <Box>
              <span css={styles.fieldLabel}>Generated palette</span>
              <Box css={styles.swatchRow}>
                {SWATCH_KEYS.map(({ key, label }) => (
                  <Box key={key} css={styles.swatchItem}>
                    <Box
                      css={styles.swatchColor}
                      style={{ backgroundColor: currentScheme[key] ?? '#888' }}
                    />
                    <span css={styles.swatchLabel}>{label}</span>
                  </Box>
                ))}
              </Box>
              <Box css={{ marginTop: '0.4rem' }}>
                <span css={styles.activeChip}>✨ AI theme active</span>
              </Box>
            </Box>
          )}

          {/* Processing indicator */}
          {isGenerating && (
            <Box css={styles.processingRow}>
              <span css={styles.dot} />
              <span css={styles.dot} style={{ animationDelay: '0.15s' }} />
              <span css={styles.dot} style={{ animationDelay: '0.3s' }} />
              <span>Generating…</span>
            </Box>
          )}

          {/* Buttons */}
          <Box css={styles.btnRow}>
            {appliedScheme && (
              <button
                type="button"
                css={styles.resetBtn}
                onClick={handleReset}
                disabled={isGenerating}
              >
                Reset
              </button>
            )}
            <button
              type="button"
              css={styles.generateBtn}
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
            >
              {isGenerating ? 'Generating…' : '✦ Generate'}
            </button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AIThemePanel;
