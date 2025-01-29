import { memo } from 'react';
import type { SuggestionItem } from '../types/suggestions';

/** Props for the suggestions list component */
interface SuggestionsListProps<T extends SuggestionItem = string> {
  suggestions: T[];
  selectedIndex: number;
  onSelect: (suggestion: T) => void;
  renderSuggestion?: (suggestion: T) => JSX.Element;
}

export const SuggestionsList = memo(function SuggestionsList<
  T extends SuggestionItem = string
>({
  suggestions,
  selectedIndex,
  onSelect,
  renderSuggestion,
}: SuggestionsListProps<T>) {
  return (
    <div className='zentara-suggestions'>
      {suggestions.map((suggestion, index) => (
        <button
          key={suggestion.toString()}
          type='button'
          onClick={() => onSelect(suggestion)}
          className='zentara-suggestion-item'
          data-selected={index === selectedIndex ? 'true' : 'false'}
        >
          {renderSuggestion?.(suggestion) ?? (
            <span className='zentara-suggestion-text'>
              {suggestion.toString()}
            </span>
          )}
        </button>
      ))}
    </div>
  );
});
