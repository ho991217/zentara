import type { Plugin } from '../plugin';

/** Plugin state management interface */
export interface PluginStateManager<TState> {
  /**
   * Get the current state of the plugin.
   * This is a low-level API that directly returns the state object.
   * In React components, prefer using `usePluginState` instead.
   *
   * @example
   * ```ts
   * // Direct state access (low-level)
   * const currentState = stateManager.getState();
   * console.log(currentState.value);
   * ```
   */
  getState: () => TState;

  /**
   * Update the plugin state partially or fully.
   * Only the properties specified in the newState object will be updated.
   * Other properties will retain their current values.
   * This will trigger a notification to all subscribers.
   *
   * @param newState - Partial state object containing only the properties to update
   *
   * @example
   * ```ts
   * // Update specific properties
   * stateManager.setState({ isOpen: true, selectedIndex: 0 });
   *
   * // Update nested properties
   * stateManager.setState({
   *   user: { ...currentState.user, name: 'New Name' }
   * });
   * ```
   */
  setState: (newState: Partial<TState>) => void;

  /**
   * Subscribe to state changes.
   * This is a low-level API primarily used for non-React contexts or internal implementation.
   * In React components, prefer using `usePluginState` which handles subscriptions automatically.
   *
   * @param callback - Function to be called whenever the state changes
   * @returns Unsubscribe function that should be called to clean up the subscription
   *
   * @example
   * ```ts
   * // External state subscription (non-React)
   * const unsubscribe = stateManager.subscribe(() => {
   *   const newState = stateManager.getState();
   *   console.log('State updated:', newState);
   * });
   *
   * // Clean up subscription
   * unsubscribe();
   *
   * // Usage in WebSocket or other external systems
   * init: () => {
   *   const ws = new WebSocket('...');
   *   const unsubscribe = stateManager.subscribe(() => {
   *     ws.send(JSON.stringify(stateManager.getState()));
   *   });
   *   return () => {
   *     unsubscribe();
   *     ws.close();
   *   };
   * }
   * ```
   */
  subscribe: (callback: () => void) => () => void;

  /**
   * Reset the state to its initial values.
   * This is useful for clearing the state when the plugin needs to return to its original state.
   * This will trigger a notification to all subscribers.
   *
   * @example
   * ```ts
   * // Reset on escape key
   * onKeyDown: (event) => {
   *   if (event.key === 'Escape') {
   *     stateManager.reset();
   *   }
   * }
   *
   * // Reset after successful operation
   * onSubmit: async () => {
   *   await saveData();
   *   stateManager.reset();
   * }
   * ```
   */
  reset: () => void;

  /**
   * Clean up all resources used by the plugin.
   * This includes clearing all subscriptions and resetting the state.
   * Should be called when the plugin is being unmounted or destroyed.
   *
   * @example
   * ```ts
   * // Clean up in React useEffect
   * useEffect(() => {
   *   return () => {
   *     stateManager.destroy();
   *   };
   * }, []);
   *
   * // Clean up in plugin unmount
   * onUnmount: () => {
   *   stateManager.destroy();
   * }
   * ```
   */
  destroy: () => void;

  /**
   * React hook for subscribing to plugin state changes.
   * This is the recommended way to access plugin state in React components.
   * Automatically handles subscription and cleanup.
   * Returns the current state and re-renders the component when state changes.
   *
   * @returns Current plugin state
   *
   * @example
   * ```tsx
   * function MyComponent() {
   *   // Automatically subscribes to state changes
   *   const state = stateManager.usePluginState();
   *
   *   return (
   *     <div>
   *       {state.isOpen && <Overlay />}
   *       <span>{state.selectedItem?.name}</span>
   *     </div>
   *   );
   * }
   * ```
   */
  usePluginState: () => TState;
}

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
