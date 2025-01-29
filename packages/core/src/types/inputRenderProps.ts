import type { KeyboardEvent, ChangeEvent, CSSProperties } from 'react';
import { PluginContext } from './pluginContext';

/**
 * Props passed to custom input renderer function.
 * Extends PluginContext with additional props specific to input rendering.
 * Use this when implementing a custom input component through renderInput.
 *
 * @template TConfig - Type of the plugin-specific configuration
 *
 * @example
 * ```tsx
 * renderInput: (props) => {
 *   const {
 *     value,
 *     onChange,
 *     onKeyDown,
 *     className,
 *     placeholder
 *   } = props;
 *
 *   return (
 *     <div className="custom-input-wrapper">
 *       <input
 *         value={value}
 *         onChange={onChange}
 *         onKeyDown={onKeyDown}
 *         className={className}
 *         placeholder={placeholder}
 *       />
 *       <div className="decorations">
 *         [Custom UI elements]
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 */
export interface InputRenderProps<TConfig = unknown>
  extends PluginContext<TConfig> {
  /**
   * Handler for input change events.
   * Must be called when the input value changes to maintain functionality.
   * This triggers the standard React controlled input behavior.
   */
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;

  /**
   * Handler for keydown events.
   * Must be called to maintain plugin keyboard interactions.
   * This allows plugins to respond to keyboard events.
   */
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;

  /**
   * Handler for selection events.
   * Must be called when the input selection changes.
   * This keeps the cursor position in context up-to-date.
   */
  onSelect: () => void;

  /**
   * CSS class name to apply to the input element.
   * Combines core styles with any custom styles.
   */
  className?: string;

  /**
   * Placeholder text to show when the input is empty.
   * This is passed through from ZentaraInput props.
   */
  placeholder?: string;

  /**
   * CSS styles to apply to the input element.
   * This is passed through from ZentaraInput props.
   */
  style?: CSSProperties;
}
