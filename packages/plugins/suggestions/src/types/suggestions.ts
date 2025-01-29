/** Base type for suggestion triggers */
export type SuggestionTrigger = string | RegExp;

/** Base type for suggestion items */
export type SuggestionItem = string;

/** Interface for defining suggestion rules */
export interface SuggestionRule<T extends SuggestionItem = string> {
  /** An array of strings or regular expressions that trigger the suggestion */
  triggers: SuggestionTrigger[];
  /** A list of suggestions to search for */
  suggestions: T[];
  /** A function that transforms the selected suggestion into the final text */
  transform: (suggestion: T) => string;
  /** Optional custom rendering of suggestion items */
  renderSuggestion?: (suggestion: T) => JSX.Element;
}

/** Configuration options for the suggestions plugin */
export interface SuggestionsPluginConfig<T extends SuggestionItem = string> {
  /** List of suggestion rules */
  rules: SuggestionRule<T>[];
  /** Maximum number of suggestions to show */
  maxSuggestions?: number;
}