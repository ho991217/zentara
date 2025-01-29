import type { ReactNode } from 'react';

/** Base type for suggestion triggers */
export type SuggestionTrigger = string | RegExp;

/** Base type for suggestion items */
export type SuggestionItem = string;

/** Interface for defining suggestion rules */
export interface SuggestionRule<T extends SuggestionItem = string> {
  /** An array of strings or regular expressions that trigger the suggestion */
  triggers: string[];
  /** A list of suggestions to search for */
  suggestions: T[];
  /** A function that transforms the selected suggestion into the final text */
  transform: (suggestion: T) => string;
  /** Optional custom rendering of suggestion items */
  renderSuggestion?: (suggestion: T) => ReactNode;
}

/** Configuration options for the suggestions plugin */
export interface SuggestionsPluginConfig {
  triggers: string[];
  suggestions: string[];
  transform?: (suggestion: string) => string;
  maxSuggestions?: number;
  renderSuggestion?: (suggestion: string) => ReactNode;
}

export interface SuggestionsPluginState {
  isOpen: boolean;
  suggestions: string[];
  selectedIndex: number;
  currentChunk: {
    text: string;
    start: number;
    end: number;
    trigger: string;
  } | null;
}
