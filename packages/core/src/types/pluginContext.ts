import { RefObject } from 'react';

/**
 * Context object passed to all plugin methods.
 * Contains the current state of the input and methods to interact with it.
 * This is the primary way plugins interact with the input component.
 *
 * @template TConfig - Type of the plugin-specific configuration
 *
 * @example
 * ```ts
 * // Accessing input value and cursor position
 * onValueChange: (value, context) => {
 *   const cursorPos = context.cursor.start;
 *   const textBeforeCursor = value.slice(0, cursorPos);
 *   return value;
 * }
 *
 * // Modifying input value
 * onKeyDown: (event, context) => {
 *   if (event.key === 'Tab') {
 *     context.setValue(context.value + '  ');
 *     event.preventDefault();
 *   }
 * }
 *
 * // Accessing DOM element
 * init: (context) => {
 *   const input = context.inputRef.current;
 *   input?.focus();
 * }
 *
 * // Using shared state between plugins
 * init: (context) => {
 *   context.shared.myPlugin = {
 *     someState: 'value'
 *   };
 * }
 * ```
 */
export interface PluginContext<TConfig = unknown> {
  /**
   * The current value of the input element.
   * This is always up-to-date with the latest user input.
   */
  value: string;

  /**
   * Function to programmatically update the input value.
   * Triggers all relevant event handlers (onValueChange, etc.).
   *
   * @param value - The new value to set
   */
  setValue: (value: string) => void;

  /**
   * The current cursor position in the input.
   * Contains both the start and end positions for text selection.
   * If no text is selected, start and end will be the same.
   */
  cursor: {
    /** Starting position of the cursor or selection */
    start: number;
    /** Ending position of the cursor or selection */
    end: number;
  };

  /**
   * Reference to the underlying input DOM element.
   * Use this for direct DOM manipulation when necessary.
   * Note: Prefer using provided methods over direct DOM manipulation.
   */
  inputRef: RefObject<HTMLInputElement>;

  /**
   * Plugin-specific configuration passed through ZentaraInput props.
   * Type is defined by the plugin's TConfig template parameter.
   */
  config?: TConfig;
}
