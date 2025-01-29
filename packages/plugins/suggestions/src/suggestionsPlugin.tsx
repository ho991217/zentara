import { useMemo, useCallback } from 'react';
import { SUGGESTION_CONFIG } from './constants';
import { getSuggestions } from './utils/getSuggestions';
import { findMatchingRule } from './utils/findMatchingRule';
import type {
  SuggestionItem,
  SuggestionRule,
  SuggestionsPluginConfig,
} from './types';
import { SuggestionsList } from './components/SuggestionList';
import { createPlugin } from '@zentara/core';

/** Internal state for managing suggestions */
interface PluginState<T extends SuggestionItem = string> {
  isOpen: boolean;
  selectedIndex: number;
  activeTrigger: string | null;
  activeRule: SuggestionRule<T> | null;
}

const initialState: PluginState = {
  isOpen: false,
  selectedIndex: -1,
  activeTrigger: null,
  activeRule: null,
};

export const suggestionsPlugin = createPlugin<
  SuggestionsPluginConfig,
  PluginState
>({
  initialState,
  create: (stateManager) => ({
    name: 'suggestions',

    onValueChange: (value, context) => {
      const config = context.config ?? {
        rules: [],
        maxSuggestions: SUGGESTION_CONFIG.DEFAULT_MAX_SUGGESTION_COUNT,
      };
      const beforeCursor = value.slice(0, context.cursor.start);

      const match = findMatchingRule(beforeCursor, config.rules);
      if (match) {
        const triggerIndex = beforeCursor.lastIndexOf(match.trigger);
        const searchText = beforeCursor.slice(
          triggerIndex + match.trigger.length
        );

        // 공백이 있으면 suggestions를 닫음
        if (searchText.includes(' ')) {
          stateManager.reset();
          return value;
        }

        // 초기 suggestions 목록을 가져옴
        const suggestions = getSuggestions(searchText, match.rule).slice(
          0,
          config.maxSuggestions
        );

        // suggestions가 있을 때만 상태를 업데이트
        if (suggestions.length > 0) {
          stateManager.setState({
            isOpen: true,
            selectedIndex: 0,
            activeTrigger: match.trigger,
            activeRule: match.rule,
          });
        } else {
          stateManager.reset();
        }
      } else {
        stateManager.reset();
      }

      return value;
    },

    onKeyDown: (event, context) => {
      const state = stateManager.getState();
      if (!state.isOpen || !state.activeTrigger || !state.activeRule) {
        return;
      }

      const config = context.config ?? {
        rules: [],
        maxSuggestions: SUGGESTION_CONFIG.DEFAULT_MAX_SUGGESTION_COUNT,
      };
      const value = context.value;
      const beforeCursor = value.slice(0, context.cursor.start);
      const triggerIndex = beforeCursor.lastIndexOf(state.activeTrigger);

      if (triggerIndex === -1) {
        stateManager.reset();
        return;
      }

      const searchText = beforeCursor.slice(
        triggerIndex + state.activeTrigger.length
      );

      if (searchText.includes(' ')) {
        stateManager.reset();
        return;
      }

      const suggestions = getSuggestions(searchText, state.activeRule).slice(
        0,
        config.maxSuggestions
      );

      if (suggestions.length === 0) {
        stateManager.reset();
        return;
      }

      switch (event.key) {
        case 'ArrowDown':
          stateManager.setState({
            selectedIndex: Math.min(
              state.selectedIndex + 1,
              suggestions.length - 1
            ),
          });
          event.preventDefault();
          break;
        case 'ArrowUp':
          stateManager.setState({
            selectedIndex: Math.max(state.selectedIndex - 1, 0),
          });
          event.preventDefault();
          break;
        case 'Enter':
        case 'Tab':
          if (state.selectedIndex >= 0) {
            const selected = suggestions[state.selectedIndex];
            if (selected && state.activeRule) {
              const transformed = state.activeRule.transform(selected);
              const newValue = `${value.slice(
                0,
                triggerIndex
              )}${transformed}${value.slice(context.cursor.start)}`;
              context.setValue(newValue);
              stateManager.reset();
              event.preventDefault();
            }
          }
          break;
        case 'Escape':
          stateManager.reset();
          event.preventDefault();
          break;
      }
    },

    renderOverlay: (context) => {
      const config = context.config ?? {
        rules: [],
        maxSuggestions: SUGGESTION_CONFIG.DEFAULT_MAX_SUGGESTION_COUNT,
      };
      const state = stateManager.usePluginState();

      const value = context.value;
      const beforeCursor = value.slice(0, context.cursor.start);

      const suggestions = useMemo(() => {
        if (!state.isOpen || !state.activeTrigger || !state.activeRule) {
          return [];
        }

        const triggerIndex = beforeCursor.lastIndexOf(state.activeTrigger);
        if (triggerIndex === -1) {
          return [];
        }

        const searchText = beforeCursor.slice(
          triggerIndex + state.activeTrigger.length
        );

        return getSuggestions(searchText, state.activeRule).slice(
          0,
          config.maxSuggestions
        );
      }, [beforeCursor, config.maxSuggestions, state]);

      const handleSuggestionSelect = useCallback(
        (suggestion: SuggestionItem) => {
          if (!state.isOpen || !state.activeTrigger || !state.activeRule) {
            return;
          }

          const triggerIndex = beforeCursor.lastIndexOf(state.activeTrigger);
          if (triggerIndex === -1) {
            stateManager.reset();
            return;
          }

          const transformed = state.activeRule.transform(suggestion);
          const newValue = `${value.slice(
            0,
            triggerIndex
          )}${transformed}${value.slice(context.cursor.start)}`;
          context.setValue(newValue);
          stateManager.reset();
        },
        [
          beforeCursor,
          context.cursor.start,
          context.setValue,
          state,
          stateManager.reset,
          value,
        ]
      );

      if (!state.isOpen || suggestions.length === 0) {
        return null;
      }

      return (
        <SuggestionsList
          suggestions={suggestions}
          selectedIndex={state.selectedIndex}
          onSelect={handleSuggestionSelect}
          renderSuggestion={state.activeRule?.renderSuggestion}
        />
      );
    },
  }),
});
