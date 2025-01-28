import { useState, useEffect, useMemo, useCallback } from 'react';
import { getSuggestions } from './utils/getSuggestions';
import { findMatchingRule } from './utils/findMatchingRule';
import type {
  SuggestionItem,
  SuggestionRule,
  SuggestionsPluginConfig,
} from './types';
import { SuggestionsList } from './components/SuggestionList';
import type { Plugin } from '@zentara/core';

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

// Use a Map to store subscribers for better performance
const subscribers = new Map<() => void, boolean>();

/** Notify all subscribers of state changes */
const notify = () => {
  subscribers.forEach((_, subscriber) => subscriber());
};

let pluginState = { ...initialState };

/** Update plugin state and notify subscribers */
const setState = (newState: Partial<PluginState>) => {
  pluginState = { ...pluginState, ...newState };
  notify();
};

/** The suggestions plugin implementation */
export const suggestionsPlugin: Plugin<SuggestionsPluginConfig> = {
  name: 'suggestions',

  onValueChange: (value, context) => {
    const config = context.config ?? { rules: [], maxSuggestions: 5 };
    const beforeCursor = value.slice(0, context.cursor.start);

    const match = findMatchingRule(beforeCursor, config.rules);
    if (match) {
      setState({
        isOpen: true,
        selectedIndex: 0,
        activeTrigger: match.trigger,
        activeRule: match.rule,
      });
    } else {
      setState({ ...initialState });
    }

    return value;
  },

  onKeyDown: (event, context) => {
    if (
      !pluginState.isOpen ||
      !pluginState.activeTrigger ||
      !pluginState.activeRule
    ) {
      return;
    }

    const config = context.config ?? { rules: [], maxSuggestions: 5 };
    const value = context.value;
    const beforeCursor = value.slice(0, context.cursor.start);
    const triggerIndex = beforeCursor.lastIndexOf(pluginState.activeTrigger);

    if (triggerIndex === -1) {
      setState({ ...initialState });
      return;
    }

    const searchText = beforeCursor.slice(
      triggerIndex + pluginState.activeTrigger.length
    );

    if (searchText.includes(' ')) {
      setState({ ...initialState });
      return;
    }

    const suggestions = getSuggestions(
      searchText,
      pluginState.activeRule
    ).slice(0, config.maxSuggestions);

    if (suggestions.length === 0) {
      setState({ ...initialState });
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        setState({
          selectedIndex: Math.min(
            pluginState.selectedIndex + 1,
            suggestions.length - 1
          ),
        });
        event.preventDefault();
        break;
      case 'ArrowUp':
        setState({
          selectedIndex: Math.max(pluginState.selectedIndex - 1, 0),
        });
        event.preventDefault();
        break;
      case 'Enter':
      case 'Tab':
        if (pluginState.selectedIndex >= 0) {
          const selected = suggestions[pluginState.selectedIndex];
          if (selected && pluginState.activeRule) {
            const transformed = pluginState.activeRule.transform(selected);
            const newValue = `${value.slice(
              0,
              triggerIndex
            )}${transformed}${value.slice(context.cursor.start)}`;
            context.setValue(newValue);
            setState({ ...initialState });
            event.preventDefault();
          }
        }
        break;
      case 'Escape':
        setState({ ...initialState });
        event.preventDefault();
        break;
    }
  },

  renderOverlay: (context) => {
    const [, forceUpdate] = useState({});
    const config = context.config ?? { rules: [], maxSuggestions: 5 };

    useEffect(() => {
      const subscriber = () => forceUpdate({});
      subscribers.set(subscriber, true);
      return () => {
        subscribers.delete(subscriber);
      };
    }, []);

    const value = context.value;
    const beforeCursor = value.slice(0, context.cursor.start);

    const suggestions = useMemo(() => {
      if (
        !pluginState.isOpen ||
        !pluginState.activeTrigger ||
        !pluginState.activeRule
      ) {
        return [];
      }

      const triggerIndex = beforeCursor.lastIndexOf(pluginState.activeTrigger);
      if (triggerIndex === -1) {
        setState({ ...initialState });
        return [];
      }

      const searchText = beforeCursor.slice(
        triggerIndex + pluginState.activeTrigger.length
      );

      if (searchText.includes(' ')) {
        setState({ ...initialState });
        return [];
      }

      return getSuggestions(searchText, pluginState.activeRule).slice(
        0,
        config.maxSuggestions
      );
    }, [beforeCursor, config.maxSuggestions]);

    const handleSuggestionSelect = useCallback(
      (suggestion: SuggestionItem) => {
        if (
          !pluginState.isOpen ||
          !pluginState.activeTrigger ||
          !pluginState.activeRule
        ) {
          return;
        }

        const triggerIndex = beforeCursor.lastIndexOf(
          pluginState.activeTrigger
        );
        if (triggerIndex === -1) {
          setState({ ...initialState });
          return;
        }

        const transformed = pluginState.activeRule.transform(suggestion);
        const newValue = `${value.slice(
          0,
          triggerIndex
        )}${transformed}${value.slice(context.cursor.start)}`;
        context.setValue(newValue);
        setState({ ...initialState });
      },
      [beforeCursor, value, context.cursor.start, context.setValue]
    );

    if (!pluginState.isOpen || suggestions.length === 0) {
      return null;
    }

    return (
      <SuggestionsList
        suggestions={suggestions}
        selectedIndex={pluginState.selectedIndex}
        onSelect={handleSuggestionSelect}
        renderSuggestion={pluginState.activeRule?.renderSuggestion}
      />
    );
  },
};
