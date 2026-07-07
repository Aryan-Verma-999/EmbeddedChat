import { css } from '@emotion/react';

export const getAIThemePanelStyles = (theme) => ({
  panel: css`
    padding: 0.5rem;
    border: 1px solid ${theme.colors.border};
    border-radius: 0.25rem;
  `,

  header: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    padding: 0.25rem 0;
    user-select: none;
  `,

  headerTitle: css`
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.875rem;
    font-weight: 600;
  `,

  badge: css`
    font-size: 0.6rem;
    padding: 0.1rem 0.4rem;
    border-radius: 1rem;
    background: ${theme.colors.primary};
    color: ${theme.colors.primaryForeground};
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  `,

  body: css`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding-top: 0.75rem;
  `,

  fieldLabel: css`
    font-size: 0.72rem;
    font-weight: 600;
    color: ${theme.colors.mutedForeground};
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.2rem;
    display: block;
  `,

  input: css`
    width: 100%;
    font-size: 0.8rem;
    padding: 0.35rem 0.5rem;
    border-radius: 0.25rem;
    border: 1px solid ${theme.colors.border};
    background: ${theme.colors.background};
    color: ${theme.colors.foreground};
    font-family: inherit;
    outline: none;
    box-sizing: border-box;
    &:focus {
      border-color: ${theme.colors.ring};
    }
  `,

  textarea: css`
    width: 100%;
    min-height: 3.5rem;
    resize: vertical;
    font-size: 0.8rem;
    padding: 0.35rem 0.5rem;
    border-radius: 0.25rem;
    border: 1px solid ${theme.colors.border};
    background: ${theme.colors.background};
    color: ${theme.colors.foreground};
    font-family: inherit;
    outline: none;
    box-sizing: border-box;
    &:focus {
      border-color: ${theme.colors.ring};
    }
  `,

  hint: css`
    font-size: 0.68rem;
    color: ${theme.colors.mutedForeground};
    line-height: 1.5;
    margin: 0;
  `,

  swatchRow: css`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.35rem;
  `,

  swatchItem: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.2rem;
  `,

  swatchColor: css`
    width: 100%;
    height: 1.5rem;
    border-radius: 0.2rem;
    border: 1px solid ${theme.colors.border};
  `,

  swatchLabel: css`
    font-size: 0.6rem;
    color: ${theme.colors.mutedForeground};
    text-align: center;
  `,

  btnRow: css`
    display: flex;
    gap: 0.4rem;
    align-items: center;
  `,

  generateBtn: css`
    flex: 1;
    font-size: 0.78rem;
    padding: 0.4rem 0.75rem;
    border-radius: 0.25rem;
    background: ${theme.colors.primary};
    color: ${theme.colors.primaryForeground};
    border: none;
    cursor: pointer;
    font-weight: 600;
    &:hover {
      opacity: 0.9;
    }
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `,

  resetBtn: css`
    font-size: 0.78rem;
    padding: 0.4rem 0.75rem;
    border-radius: 0.25rem;
    background: transparent;
    color: ${theme.colors.mutedForeground};
    border: 1px solid ${theme.colors.border};
    cursor: pointer;
    &:hover {
      background: ${theme.colors.muted};
    }
  `,

  processingRow: css`
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.75rem;
    color: ${theme.colors.mutedForeground};
  `,

  dot: css`
    width: 0.4rem;
    height: 0.4rem;
    border-radius: 50%;
    background: ${theme.colors.primary};
    display: inline-block;
    animation: ai-pulse 1s infinite;
    @keyframes ai-pulse {
      0%,
      100% {
        opacity: 1;
      }
      50% {
        opacity: 0.25;
      }
    }
  `,

  activeChip: css`
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.7rem;
    padding: 0.15rem 0.5rem;
    border-radius: 1rem;
    background: ${theme.colors.accent};
    color: ${theme.colors.accentForeground};
  `,
});
