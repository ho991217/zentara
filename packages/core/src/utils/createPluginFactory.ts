import type {
  PluginStateManager,
  CreatePluginConfig,
  CreatePlugin,
} from './createPluginFactory.types';
import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for subscribing to plugin state changes
 */
function usePluginState<TState>(stateManager: PluginStateManager<TState>) {
  const [, forceUpdate] = useState({});

  const subscribe = useCallback(stateManager.subscribe, []);
  const destroy = useCallback(stateManager.destroy, []);

  useEffect(() => {
    const unsubscribe = subscribe(() => forceUpdate({}));
    return () => {
      unsubscribe();
      destroy();
    };
  }, [subscribe, destroy]);

  return stateManager.getState();
}

/**
 * Creates a plugin factory with state management
 */
export function createPluginFactory<TState, TConfig = unknown>(): CreatePlugin<
  TState,
  TConfig
> {
  return (config?: CreatePluginConfig<TState, TConfig>) => {
    if (!config) {
      throw new Error('Plugin configuration is required');
    }

    const { initialState, createPlugin } = config;

    // Create state manager
    let state = { ...initialState };
    const subscribers = new Map<() => void, boolean>();
    let isDestroyed = false;

    const notify = () => {
      if (isDestroyed) return;
      subscribers.forEach((_, subscriber) => subscriber());
    };

    const stateManager: PluginStateManager<TState> = {
      getState: () => state,
      setState: (newState) => {
        if (isDestroyed) return;
        state = { ...state, ...newState };
        notify();
      },
      subscribe: (callback) => {
        if (isDestroyed) {
          return () => {};
        }
        subscribers.set(callback, true);
        return () => {
          subscribers.delete(callback);
        };
      },
      reset: () => {
        if (isDestroyed) return;
        state = { ...initialState };
        notify();
      },
      destroy: () => {
        isDestroyed = true;
        subscribers.clear();
        state = { ...initialState };
      },
      usePluginState: () => usePluginState(stateManager),
    };

    // Create plugin instance with enhanced state management
    const plugin = createPlugin(stateManager);

    // Add cleanup method to the plugin
    return {
      ...plugin,
      destroy: stateManager.destroy,
    };
  };
}
