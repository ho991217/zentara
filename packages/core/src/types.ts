import type { KeyboardEvent, ReactNode, RefObject, ChangeEvent } from 'react';

/** Context object passed to plugin methods */
export interface PluginContext<TConfig = unknown> {
  /** The current input value */
  value: string;
  /** A function to set the input value */
  setValue: (value: string) => void;
  /** The cursor position */
  cursor: {
    start: number;
    end: number;
  };
  /** The input element ref */
  inputRef: RefObject<HTMLInputElement>;
  /** The plugin configuration */
  config?: TConfig;
  /** Shared state between plugins */
  shared: Record<string, unknown>;
}

/** Props passed to custom input renderer */
export interface InputRenderProps<TConfig = unknown>
  extends PluginContext<TConfig> {
  /** The default input event handler */
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  /** The default keydown event handler */
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  /** The default select event handler */
  onSelect: () => void;
  /** The styling class name */
  className?: string;
  /** The placeholder text */
  placeholder?: string;
}

/** Plugin interface for extending ZentaraInput functionality */
export interface Plugin<TConfig = unknown> {
  /** Unique name of the plugin */
  name: string;
  /** The plugin initialization function */
  init?: (context: PluginContext<TConfig>) => void;
  /** Called when the input value changes */
  onValueChange?: (
    value: string,
    context: PluginContext<TConfig>
  ) => string | Promise<string>;
  /** Called on keydown events */
  onKeyDown?: (event: KeyboardEvent, context: PluginContext<TConfig>) => void;
  /** Renders overlay content (e.g., suggestions) */
  renderOverlay?: (context: PluginContext<TConfig>) => ReactNode;
  /** Renders custom input component */
  renderInput?: (props: InputRenderProps<TConfig>) => ReactNode;
}

/** Plugin with configuration */
export interface PluginWithConfig<TConfig = unknown> {
  /** The plugin implementation */
  plugin: Plugin<TConfig>;
  /** Plugin configuration */
  config?: TConfig;
}
