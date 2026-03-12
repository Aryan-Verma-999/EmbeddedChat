import React from 'react';
import { css } from '@emotion/react';
import { Box, Icon, Heading, useTheme } from '@embeddedchat/ui-elements';

const getStyles = (theme) => ({
    container: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    text-align: center;
    height: 100%;
    min-height: 300px;
  `,
    icon: css`
    font-size: 3rem;
    color: ${theme.colors?.secondary || '#9ea2a8'};
    margin-bottom: 1rem;
  `,
    placeholder: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1.5rem;
    border-radius: 0.5rem;
    background-color: ${theme.colors?.background || '#f7f8fa'};
    border: 2px dashed ${theme.colors?.border || '#e4e7ea'};
    margin-top: 1rem;
  `,
    emoji: css`
    font-size: 2rem;
  `,
    description: css`
    color: ${theme.colors?.secondary || '#9ea2a8'};
    font-size: 0.875rem;
    max-width: 300px;
  `,
    badge: css`
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 600;
    background-color: #fef3cd;
    color: #856404;
    margin-top: 0.5rem;
  `,
});

const FederationRoomDiscovery = () => {
    const { theme } = useTheme();
    const styles = getStyles(theme);

    return (
        <Box css={styles.container} className="ec-federation-discovery">
            <Icon name="search" css={styles.icon} />
            <Heading level={4}>Public Room Discovery</Heading>
            <Box css={styles.placeholder} className="ec-federation-placeholder">
                <span css={styles.emoji}>🚧</span>
                <strong>Not supported yet</strong>
                <p css={styles.description}>
                    Public room discovery across federated Matrix servers will be available
                    in a future release of Rocket.Chat federation.
                </p>
                <Box css={styles.badge}>
                    <Icon name="info" size="0.75rem" />
                    <span>Beta Feature</span>
                </Box>
            </Box>
        </Box>
    );
};

export default FederationRoomDiscovery;
