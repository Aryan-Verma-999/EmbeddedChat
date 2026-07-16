import React, { useReducer, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  UiKitComponent,
  UiKitContextualBar as ContextualBarSurface,
  UiKitContext,
  contextualBarParser,
  extractInitialStateFromLayout,
} from '@embeddedchat/ui-kit';
import {
  MinimalSidebar,
  SidebarContent,
  SidebarHeader,
} from '@embeddedchat/ui-elements';
import useSidebarStore from '../../store/sidebarStore';

const reduceValues = (values, { actionId, payload }) => ({
  ...values,
  [actionId]: payload,
});

const CustomContextualBar = ({ blocks, onAction }) => {
  const setShowSidebar = useSidebarStore((state) => state.setShowSidebar);

  // Initialize and maintain local component state for inputs so that they remain interactive
  const [values, updateValues] = useReducer(
    reduceValues,
    blocks,
    extractInitialStateFromLayout
  );

  const localContextValue = useMemo(
    () => ({
      action: async ({ actionId, value, blockId, appId, viewId }) => {
        // Fire action event for button clicks/submissions
        if (onAction) {
          onAction({
            type: 'blockAction',
            actionId,
            value,
            blockId,
            appId: appId || 'custom-app',
            viewId: viewId || 'custom-view',
          });
        }
      },
      updateState: ({ actionId, value, blockId = 'default' }) => {
        // Update local state so standard inputs are functional
        updateValues({
          actionId,
          payload: {
            blockId,
            value,
          },
        });
        // Fire action event for state updates (e.g. text input character entries)
        if (onAction) {
          onAction({
            type: 'stateUpdate',
            actionId,
            value,
            blockId,
          });
        }
      },
      values,
    }),
    [onAction, values]
  );

  return (
    <UiKitContext.Provider value={localContextValue}>
      <MinimalSidebar>
        <SidebarHeader
          title={contextualBarParser.text({
            type: 'plain_text',
            text: 'Custom View',
          })}
          onClose={() => setShowSidebar(false)}
        />
        <SidebarContent
          style={{
            padding: '0.75rem',
            height: '90%',
          }}
        >
          <UiKitComponent render={ContextualBarSurface} blocks={blocks} />
        </SidebarContent>
      </MinimalSidebar>
    </UiKitContext.Provider>
  );
};

CustomContextualBar.propTypes = {
  blocks: PropTypes.arrayOf(PropTypes.object).isRequired,
  onAction: PropTypes.func,
};

export default CustomContextualBar;
