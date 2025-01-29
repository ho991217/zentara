import type { Plugin } from '../plugin';
import { PluginStateManager } from './StateManager.types';

/** Plugin factory configuration */
export interface CreatePluginConfig<TState, TConfig = unknown> {
  /** Initial state for the plugin */
  initialState: TState;
  /** Plugin implementation using state manager */
  createPlugin: (stateManager: PluginStateManager<TState>) => Plugin<TConfig>;
}

/** Plugin factory function type */
export type CreatePlugin<TState, TConfig = unknown> = (
  config?: CreatePluginConfig<TState, TConfig>
) => Plugin<TConfig>;
