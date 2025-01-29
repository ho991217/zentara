import { memo } from 'react';
import type { SuggestionItem } from '../types';

/** Props for the suggestions list component */
interface SuggestionsListProps<T extends SuggestionItem = string> {
  suggestions: T[];
  selectedIndex: number;
  onSelect: (suggestion: T) => void;
  renderSuggestion?: (suggestion: T) => JSX.Element;
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const SuggestionsList = memo(function SuggestionsList<
  T extends SuggestionItem = string
>({
  suggestions,
  selectedIndex,
  onSelect,
  renderSuggestion,
  onMouseDown,
}: SuggestionsListProps<T>) {
  return (
    <div className='zentara-suggestions' onMouseDown={onMouseDown}>
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
