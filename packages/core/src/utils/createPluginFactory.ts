import type {
  CreatePluginConfig,
  CreatePlugin,
} from '../types';
import { StateManager } from './StateManager';

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

    const stateManager = new StateManager(config.initialState);
    const plugin = config.createPlugin(stateManager);

    return {
      ...plugin,
      destroy: stateManager.destroy,
    };
  };
}
