import { memo, ReactNode, CSSProperties } from 'react';
import type { SuggestionItem } from '../types';

/** Props for the suggestions list component */
interface SuggestionsListProps<T extends SuggestionItem = string> {
  suggestions: T[];
  selectedIndex: number;
  onSelect: (suggestion: T) => void;
  renderSuggestion?: (suggestion: T) => ReactNode;
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void;
  style?: CSSProperties;
}

export const SuggestionsList = memo(function SuggestionsList<
  T extends SuggestionItem = string
>({
  suggestions,
  selectedIndex,
  onSelect,
  renderSuggestion,
  onMouseDown,
  style,
}: SuggestionsListProps<T>) {
  return (
    <div
      className='zentara-suggestions'
      onMouseDown={onMouseDown}
      style={style}
    >
      {suggestions.map((suggestion, index) => (
        <button
          key={suggestion.toString()}
          type='button'
          onClick={() => onSelect(suggestion)}
          className='zentara-suggestion-item'
          data-selected={index === selectedIndex ? 'true' : 'false'}
        >
          {renderSuggestion?.(suggestion) ?? suggestion.toString()}
        </button>
      ))}
    </div>
  );
});
