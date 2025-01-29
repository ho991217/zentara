import type { PluginContext, PluginStateManager } from '@zentara/core';
import type {
  SuggestionsPluginConfig,
  SuggestionsPluginState,
} from '../types/suggestions';
import { getCurrentChunk } from './getCurrentChunk';

export const updateSuggestions = (
  context: PluginContext<SuggestionsPluginConfig>,
  stateManager: PluginStateManager<SuggestionsPluginState>
) => {
  const config = context.config;
  if (!config) return;

  const chunk = getCurrentChunk(
    context.value,
    context.cursor.start,
    config.triggers
  );

  if (!chunk) {
    if (stateManager.getState().isOpen) {
      stateManager.reset();
    }
    return;
  }

  const searchText = chunk.text.slice(chunk.trigger.length).toLowerCase();
  const filteredSuggestions = config.suggestions.filter((suggestion: string) =>
    suggestion.toLowerCase().startsWith(searchText)
  );

  if (filteredSuggestions.length > 0) {
    stateManager.setState({
      isOpen: true,
      suggestions: filteredSuggestions,
      selectedIndex: 0,
      currentChunk: chunk,
    });
  } else {
    stateManager.reset();
  }
};
