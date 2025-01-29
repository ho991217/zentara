import type { Plugin } from './plugin';
import { PluginStateManager } from './stateManager';

/** Plugin factory configuration */
export interface CreatePluginConfig<TConfig = unknown, TState = null> {
  /** Initial state for the plugin */
  initialState: TState;
  /** Plugin implementation using state manager */
  createPlugin: (
    stateManager: TState extends null ? null : PluginStateManager<TState>
  ) => Plugin<TConfig>;
}

/** Plugin factory function type */
export type CreatePlugin<TConfig = unknown, TState = null> = (
  config?: CreatePluginConfig<TConfig, TState>
) => Plugin<TConfig>;
