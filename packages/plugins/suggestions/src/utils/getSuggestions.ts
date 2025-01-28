import { memo } from 'react';
import type { SuggestionItem, SuggestionRule } from '../types';

/** Filter suggestions based on search text */
export const getSuggestions = <T extends SuggestionItem = string>(
  searchText: string,
  rule: SuggestionRule<T>
): T[] => {
  return rule.suggestions.filter((suggestion) =>
    suggestion.toString().toLowerCase().includes(searchText.toLowerCase())
  );
};
