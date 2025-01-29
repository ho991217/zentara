import type { Plugin } from './plugin';
import { PluginStateManager } from './stateManager';

/** Plugin factory configuration */
export interface CreatePluginConfig<TConfig = unknown, TState = null> {
  /** Initial state for the plugin */
  initialState: TState extends null ? never : TState;
  /** Plugin implementation using state manager */
  create: (stateManager: PluginStateManager<TState>) => Plugin<TConfig>;
}
