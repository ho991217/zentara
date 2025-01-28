import type { KeyboardEvent, ReactNode } from 'react';
import type { InputRenderProps, PluginContext } from './types';

/** Plugin interface for extending ZentaraInput functionality */
export interface Plugin<TConfig = unknown> {
  /**
   * Unique identifier for the plugin.
   * This name is used to identify the plugin in the ZentaraInput configuration
   * and must be unique across all plugins.
   *
   * @example
   * ```ts
   * name: 'suggestions'
   * name: 'mentions'
   * name: 'emoji-picker'
   * ```
   */
  name: string;

  /**
   * Initialization function called when the plugin is first mounted.
   * Use this to set up any external resources, event listeners, or initial state.
   * Returns a cleanup function that will be called when the plugin is unmounted.
   *
   * @param context - The plugin context containing current input state and methods
   * @returns Optional cleanup function
   *
   * @example
   * ```ts
   * init: (context) => {
   *   // Set up WebSocket connection
   *   const ws = new WebSocket('...');
   *   ws.onmessage = (event) => {
   *     // Handle real-time updates
   *   };
   *
   *   // Return cleanup function
   *   return () => {
   *     ws.close();
   *   };
   * }
   * ```
   */
  init?: ((context: PluginContext<TConfig>) => void) | (() => void);

  /**
   * Called whenever the input value changes.
   * Use this to modify the input value or trigger side effects.
   * Can return a modified value synchronously or asynchronously.
   *
   * @param value - The current input value
   * @param context - The plugin context
   * @returns The modified input value (or Promise of it)
   *
   * @example
   * ```ts
   * // Synchronous transformation
   * onValueChange: (value) => {
   *   return value.toLowerCase();
   * }
   *
   * // Asynchronous transformation
   * onValueChange: async (value, context) => {
   *   const suggestion = await fetchSuggestion(value);
   *   return suggestion;
   * }
   *
   * // Side effects without value modification
   * onValueChange: (value, context) => {
   *   saveToLocalStorage(value);
   *   return value;
   * }
   * ```
   */
  onValueChange?: (
    value: string,
    context: PluginContext<TConfig>
  ) => string | Promise<string>;

  /**
   * Called on every keydown event in the input.
   * Use this to handle keyboard shortcuts or modify input behavior.
   * Call event.preventDefault() to prevent default browser behavior.
   *
   * @param event - The keyboard event
   * @param context - The plugin context
   *
   * @example
   * ```ts
   * onKeyDown: (event, context) => {
   *   // Handle keyboard shortcuts
   *   if (event.ctrlKey && event.key === 'b') {
   *     event.preventDefault();
   *     toggleBold();
   *   }
   *
   *   // Handle special keys
   *   if (event.key === 'Tab') {
   *     event.preventDefault();
   *     handleTabCompletion();
   *   }
   *
   *   // Navigation
   *   if (event.key === 'ArrowDown') {
   *     event.preventDefault();
   *     selectNextItem();
   *   }
   * }
   * ```
   */
  onKeyDown?: (
    event: KeyboardEvent<HTMLInputElement>,
    context: PluginContext<TConfig>
  ) => void;

  /**
   * Renders additional content that overlays the input.
   * Use this to show suggestions, tooltips, or any other floating UI elements.
   * The overlay will be positioned relative to the input element.
   *
   * @param context - The plugin context
   * @returns React node to render as overlay
   *
   * @example
   * ```tsx
   * renderOverlay: (context) => {
   *   const state = stateManager.usePluginState();
   *
   *   if (!state.isOpen) return null;
   *
   *   return (
   *     <Portal>
   *       <div className="overlay">
   *         {state.items.map(item => (
   *           <Item
   *             key={item.id}
   *             item={item}
   *             onClick={() => selectItem(item)}
   *           />
   *         ))}
   *       </div>
   *     </Portal>
   *   );
   * }
   * ```
   */
  renderOverlay?: (context: PluginContext<TConfig>) => ReactNode;

  /**
   * Renders a custom input component instead of the default one.
   * Use this to completely customize the input's appearance and behavior.
   * Must forward all necessary props to maintain core functionality.
   *
   * @param props - Props that must be forwarded to maintain functionality
   * @returns Custom input component
   *
   * @example
   * ```tsx
   * renderInput: (props) => {
   *   return (
   *     <div className="custom-input-wrapper">
   *       <input
   *         {...props}
   *         className={clsx(props.className, 'custom-input')}
   *       />
   *       <div className="custom-decorations">
   *         [Custom decorations will be rendered here]
   *       </div>
   *     </div>
   *   );
   * }
   * ```
   */
  renderInput?: (props: InputRenderProps<TConfig>) => ReactNode;

  /**
   * Cleanup method called when the plugin is being unmounted.
   * Use this to clean up any resources, subscriptions, or side effects.
   * This is different from the init cleanup as it's called when the plugin itself is **destroyed**.
   * So it is recommended to use this method to clean up resources permanently.
   *
   * @example
   * ```ts
   * destroy: () => {
   *   // Clean up resources
   *   websocket.close();
   *   document.removeEventListener('click', handler);
   *   clearInterval(interval);
   *
   *   // Clear caches
   *   localStorage.removeItem('plugin-cache');
   * }
   * ```
   */
  destroy?: () => void;
}

/** Plugin with configuration */
export interface PluginWithConfig<TConfig = unknown> {
  /** The plugin implementation */
  plugin: Plugin<TConfig>;
  /** Plugin configuration */
  config?: TConfig;
}
