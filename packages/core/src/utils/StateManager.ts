import { useState, useEffect } from 'react';
import type { PluginStateManager } from './StateManager.types.ts';

/**
 * Hook for subscribing to plugin state changes
 */
function usePluginState<TState>(stateManager: PluginStateManager<TState>) {
  const [state, setState] = useState(() => stateManager.getState());

  useEffect(() => {
    const unsubscribe = stateManager.subscribe(() => {
      setState(stateManager.getState());
    });
    return unsubscribe;
  }, [stateManager]);

  return state;
}

/**
 * State manager for plugins
 */
export class StateManager<TState> implements PluginStateManager<TState> {
  private state: TState;
  private subscribers = new Set<() => void>();
  private isDestroyed = false;

  constructor(private initialState: TState) {
    this.state = { ...initialState };
  }

  getState = () => this.state;

  setState = (newState: Partial<TState>) => {
    if (this.isDestroyed) return;
    this.state = { ...this.state, ...newState };
    this.notify();
  };

  subscribe = (callback: () => void) => {
    if (this.isDestroyed) return () => {};
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  };

  reset = () => {
    if (this.isDestroyed) return;
    this.state = { ...this.initialState };
    this.notify();
  };

  destroy = () => {
    this.isDestroyed = true;
    this.subscribers.clear();
  };

  usePluginState = (): TState => usePluginState(this);

  private notify = () => {
    if (this.isDestroyed) return;
    for (const subscriber of this.subscribers) {
      subscriber();
    }
  };
}
