import type { CreatePluginConfig, Plugin } from '../types';
import { StateManager } from './StateManager';

export const createPlugin = (() => {
  return <TConfig, TState>(config: CreatePluginConfig<TConfig, TState>) => {
    if (config.initialState == null) {
      const plugin = config.create(null as never);

      return {
        ...plugin,
        destroy: () => {},
      } as Plugin<TConfig>;
    }

    const stateManager = new StateManager<TState>(config.initialState);
    const plugin = config.create(stateManager);

    return {
      ...plugin,
      destroy: stateManager.destroy,
    } as Plugin<TConfig>;
  };
})();
