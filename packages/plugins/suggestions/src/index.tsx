import { useState, useEffect } from 'react';
import type { Plugin } from '@zentara/types';
import './suggestions.css';

/** Interface for defining suggestion rules */
export interface SuggestionRule {
  /** An array of strings or regular expressions that trigger the suggestion */
  triggers: (string | RegExp)[];
  /** A list of suggestions to search for */
  suggestions: string[];
  /** A function that transforms the selected suggestion into the final text */
  transform: (suggestion: string) => string;
  /** Optional custom rendering of suggestion items */
  renderSuggestion?: (suggestion: string) => JSX.Element;
}

/** Configuration options for the suggestions plugin */
export interface SuggestionsPluginConfig {
  /** List of suggestion rules */
  rules: SuggestionRule[];
  /** Maximum number of suggestions to show */
  maxSuggestions?: number;
}

/** Internal state for managing suggestions */
interface PluginState {
  isOpen: boolean;
  selectedIndex: number;
  activeTrigger: string | null;
  activeRule: SuggestionRule | null;
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

/** Update plugin state and notify subscribers */
const setState = (newState: Partial<PluginState>) => {
  pluginState = { ...pluginState, ...newState };
  notify();
};

let pluginState = { ...initialState };

/** Find a matching rule for the given text */
const findMatchingRule = (
  text: string,
  rules: SuggestionRule[]
): {
  rule: SuggestionRule;
  trigger: string;
  match: RegExpMatchArray | null;
} | null => {
  for (const rule of rules) {
    for (const trigger of rule.triggers) {
      if (typeof trigger === 'string') {
        if (text.endsWith(trigger)) {
          return { rule, trigger, match: null };
        }
      } else {
        const regExp = new RegExp(`${trigger.source}$`, trigger.flags);
        const match = text.match(regExp);
        if (match) {
          return { rule, trigger: match[0], match };
        }
      }
    }
  }
  return null;
};

/** Filter suggestions based on search text */
const getSuggestions = (searchText: string, rule: SuggestionRule): string[] => {
  return rule.suggestions.filter((suggestion) =>
    suggestion.toLowerCase().includes(searchText.toLowerCase())
  );
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

    useEffect(() => {
      const subscriber = () => forceUpdate({});
      subscribers.set(subscriber, true);
      return () => {
        subscribers.delete(subscriber);
      };
    }, []);

    if (
      !pluginState.isOpen ||
      !pluginState.activeTrigger ||
      !pluginState.activeRule
    ) {
      return null;
    }

    const config = context.config ?? { rules: [], maxSuggestions: 5 };
    const value = context.value;
    const beforeCursor = value.slice(0, context.cursor.start);
    const triggerIndex = beforeCursor.lastIndexOf(pluginState.activeTrigger);

    if (triggerIndex === -1) return null;

    const searchText = beforeCursor.slice(
      triggerIndex + pluginState.activeTrigger.length
    );

    if (searchText.includes(' ')) return null;

    const suggestions = getSuggestions(
      searchText,
      pluginState.activeRule
    ).slice(0, config.maxSuggestions);

    if (suggestions.length === 0) return null;

    return (
      <div className='zentara-suggestions'>
        {suggestions.map((suggestion, index) => (
          <button
            key={suggestion}
            type='button'
            onClick={() => {
              if (!pluginState.activeRule) return;
              const transformed = pluginState.activeRule.transform(suggestion);
              const newValue = `${value.slice(
                0,
                triggerIndex
              )}${transformed}${value.slice(context.cursor.start)}`;
              context.setValue(newValue);
              setState({ ...initialState });
            }}
            className='zentara-suggestion-item'
            data-selected={
              index === pluginState.selectedIndex ? 'true' : 'false'
            }
          >
            {pluginState.activeRule?.renderSuggestion?.(suggestion) ?? (
              <span className='zentara-suggestion-text'>{suggestion}</span>
            )}
          </button>
        ))}
      </div>
    );
  },
};
