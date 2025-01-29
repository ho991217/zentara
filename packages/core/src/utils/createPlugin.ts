import type { CreatePluginConfig, Plugin, PluginFactory } from '../types';
import { StateManager } from './StateManager';

export const createPlugin = <TConfig, TState>(
  config: CreatePluginConfig<TConfig, TState>
): ((pluginConfig: TConfig) => PluginFactory<TConfig>) => {
  return (pluginConfig: TConfig) => {
    const createPluginInstance = () => {
      const stateManager = new StateManager<TState>(config.initialState);
      const plugin = config.create(stateManager);

      return {
        ...plugin,
        destroy: () => {
          stateManager.destroy();
          plugin.destroy?.();
        },
      } as Plugin<TConfig>;
    };

    return {
      __isPluginFactory: true as const,
      createInstance: createPluginInstance,
      config: pluginConfig,
    };
  };
};
