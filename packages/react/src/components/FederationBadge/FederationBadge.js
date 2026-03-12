import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { Box, Icon, Tooltip, useTheme } from '@embeddedchat/ui-elements';

const getFederationBadgeStyles = (theme) => css`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.125rem 0.5rem;
  border-radius: 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${theme.colors?.primary || '#1d74f5'}20;
  color: ${theme.colors?.primary || '#1d74f5'};
  border: 1px solid ${theme.colors?.primary || '#1d74f5'}40;
  cursor: help;

  .ec-federation-icon {
    font-size: 0.875rem;
  }
`;

const FederationBadge = ({ isFederated, showLabel = true }) => {
    const { theme } = useTheme();

    if (!isFederated) return null;

    return (
        <Tooltip text="This room is federated via Matrix protocol" position="bottom">
            <Box css={getFederationBadgeStyles(theme)} className="ec-federation-badge">
                <Icon name="globe" className="ec-federation-icon" />
                {showLabel && <span>Federated</span>}
            </Box>
        </Tooltip>
    );
};

FederationBadge.propTypes = {
    isFederated: PropTypes.bool,
    showLabel: PropTypes.bool,
};

export default FederationBadge;
