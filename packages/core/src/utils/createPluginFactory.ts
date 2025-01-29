import type {
  CreatePluginConfig,
  CreatePlugin,
} from '../types';
import { StateManager } from './StateManager';

/**
 * Creates a plugin factory with optional state management
 */
export function createPluginFactory<
  TConfig = unknown,
  TState = null
>(): CreatePlugin<TConfig, TState> {
  return (config?: CreatePluginConfig<TConfig, TState>) => {
    if (!config) {
      throw new Error('Plugin configuration is required');
    }

    // If the initial state is null, we don't need to create a state manager
    // and we can return the plugin directly
    if (config.initialState === null) {
      const plugin = config.createPlugin(
        null as TState extends null ? null : never
      );
      return {
        ...plugin,
        destroy: () => {},
      };
    }

    const stateManager = new StateManager(config.initialState);
    const plugin = config.createPlugin(
      stateManager as TState extends null ? never : StateManager<TState>
    );

    return {
      ...plugin,
      destroy: stateManager.destroy,
    };
  };
}
