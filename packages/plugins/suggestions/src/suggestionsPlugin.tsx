import type { PluginContext } from '@zentara/core';
import { createPlugin } from '@zentara/core';
import type { KeyboardEvent } from 'react';
import type {
  SuggestionsPluginConfig,
  SuggestionsPluginState,
} from './types/suggestions';
import { SuggestionsList } from './components/SuggestionList';
import { updateSuggestions } from './utils/updateSuggestions';

export const suggestionsPlugin = createPlugin<
  SuggestionsPluginConfig,
  SuggestionsPluginState
>({
  initialState: {
    isOpen: false,
    suggestions: [],
    selectedIndex: 0,
    currentChunk: null,
  },
  create: (stateManager) => {
    let preventBlur = false;

    const onSelect = (
      suggestion: string,
      context: PluginContext<SuggestionsPluginConfig>
    ) => {
      const state = stateManager.getState();
      const config = context.config;
      if (!state.currentChunk || !config) return;

      const transformed = config.transform
        ? config.transform(suggestion)
        : suggestion;

      const newValue = `${context.value.slice(
        0,
        state.currentChunk.start
      )}${transformed}${context.value.slice(state.currentChunk.end)}`;

      context.setValue(newValue);
      stateManager.reset();
    };

    return {
      name: 'suggestions',

      init: (context: PluginContext<SuggestionsPluginConfig>) => {
        updateSuggestions(context, stateManager);
      },

      onValueChange: async (
        value: string,
        context: PluginContext<SuggestionsPluginConfig>
      ) => {
        updateSuggestions(context, stateManager);
        return value;
      },

      onSelect: (context: PluginContext<SuggestionsPluginConfig>) => {
        updateSuggestions(context, stateManager);
      },

      onBlur: () => {
        if (!preventBlur && stateManager.getState().isOpen) {
          stateManager.reset();
        }
        preventBlur = false;
      },

      onFocus: (context: PluginContext<SuggestionsPluginConfig>) => {
        updateSuggestions(context, stateManager);
      },

      onKeyDown: (
        event: KeyboardEvent<HTMLInputElement>,
        context: PluginContext<SuggestionsPluginConfig>
      ) => {
        const state = stateManager.getState();
        const config = context.config;
        if (!state.isOpen || !state.currentChunk || !config) return;

        switch (event.key) {
          case 'ArrowUp': {
            event.preventDefault();
            stateManager.setState({
              selectedIndex: Math.max(0, state.selectedIndex - 1),
            });
            break;
          }
          case 'ArrowDown': {
            event.preventDefault();
            stateManager.setState({
              selectedIndex: Math.min(
                state.suggestions.length - 1,
                state.selectedIndex + 1
              ),
            });
            break;
          }
          case 'Enter': {
            event.preventDefault();
            if (state.selectedIndex >= 0 && state.suggestions.length > 0) {
              onSelect(state.suggestions[state.selectedIndex], context);
            }
            break;
          }
          case 'Escape': {
            event.preventDefault();
            stateManager.reset();
            break;
          }
        }
      },

      renderOverlay: (context: PluginContext<SuggestionsPluginConfig>) => {
        const state = stateManager.usePluginState();
        const config = context.config;
        if (
          !state.isOpen ||
          !state.currentChunk ||
          state.suggestions.length === 0 ||
          !config
        ) {
          return null;
        }

        // 입력 요소의 위치와 크기 정보 가져오기
        const inputElement = context.inputRef.current;
        if (!inputElement) return null;

        const inputRect = inputElement.getBoundingClientRect();

        // 커서 위치 계산을 위한 임시 span 생성
        const span = document.createElement('span');
        span.style.font = window.getComputedStyle(inputElement).font;
        span.style.position = 'absolute';
        span.style.visibility = 'hidden';
        span.textContent = inputElement.value.substring(
          0,
          state.currentChunk.start
        );
        document.body.appendChild(span);

        // 커서 위치 계산
        const cursorOffset = span.getBoundingClientRect().width;
        document.body.removeChild(span);

        // 오버레이 위치 계산
        const VERTICAL_PADDING = 8;
        const top = inputRect.bottom + VERTICAL_PADDING + window.scrollY;
        const left = inputRect.left + cursorOffset + window.scrollX;

        return (
          <SuggestionsList
            suggestions={state.suggestions}
            selectedIndex={state.selectedIndex}
            onSelect={(suggestion: string) => onSelect(suggestion, context)}
            renderSuggestion={config.renderSuggestion}
            onMouseDown={(e) => {
              e.preventDefault();
              preventBlur = true;
            }}
            style={{
              position: 'fixed',
              top: `${top}px`,
              left: `${left}px`,
              zIndex: 1000,
            }}
          />
        );
      },
    };
  },
});
