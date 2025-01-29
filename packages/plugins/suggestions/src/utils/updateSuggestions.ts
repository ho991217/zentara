import type { PluginContext, PluginStateManager } from '@zentara/core';
import type {
  SuggestionsPluginConfig,
  SuggestionsPluginState,
} from '../types/suggestions';
import { getCurrentChunk } from './getCurrentChunk';
import { SUGGESTION_CONFIG } from '@/constants';

export const updateSuggestions = (
  context: PluginContext<SuggestionsPluginConfig>,
  stateManager: PluginStateManager<SuggestionsPluginState>
) => {
  const config = context.config;
  if (!config) return;

  const state = stateManager.getState();

  // 배열 내용 비교로 변경 감지
  const newSuggestions = config.suggestions;
  if (
    newSuggestions.length !== state.availableSuggestions.length ||
    newSuggestions.some((s, i) => s !== state.availableSuggestions[i])
  ) {
    stateManager.setState({
      availableSuggestions: newSuggestions,
    });
  }

  const chunk = getCurrentChunk(
    context.value,
    context.cursor.start,
    config.triggers
  );

  if (!chunk) {
    if (state.isOpen) {
      stateManager.setState({
        isOpen: false,
        suggestions: [],
        selectedIndex: 0,
        currentChunk: null,
      });
    }
    return;
  }

  const searchText = chunk.text.slice(chunk.trigger.length).toLowerCase();
  const filteredSuggestions = newSuggestions
    .filter((suggestion: string) =>
      suggestion.toLowerCase().startsWith(searchText)
    )
    .slice(
      0,
      config.maxSuggestions ?? SUGGESTION_CONFIG.DEFAULT_MAX_SUGGESTION_COUNT
    );

  if (filteredSuggestions.length > 0) {
    stateManager.setState({
      isOpen: true,
      suggestions: filteredSuggestions,
      selectedIndex: 0,
      currentChunk: chunk,
    });
  } else {
    stateManager.setState({
      isOpen: false,
      suggestions: [],
      selectedIndex: 0,
      currentChunk: null,
    });
  }
};
