import type { KeyboardEvent, ReactNode, RefObject, ChangeEvent } from 'react';

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

export interface Plugin<TConfig = unknown> {
  name: string;
  /** The plugin initialization function (registering event listeners, setting initial state, etc.) */
  init?: (context: PluginContext<TConfig>) => void;
  /** The default input event handler */
  onValueChange?: (
    value: string,
    context: PluginContext<TConfig>
  ) => string | Promise<string>;
  /** The default keydown event handler */
  onKeyDown?: (event: KeyboardEvent, context: PluginContext<TConfig>) => void;
  /** The overlay rendering function (autocomplete, tooltip, etc.) */
  renderOverlay?: (context: PluginContext<TConfig>) => ReactNode;
  /** The input rendering function (syntax highlighting, markdown, etc.) */
  renderInput?: (props: InputRenderProps<TConfig>) => ReactNode;
}

export interface PluginWithConfig<TConfig = unknown> {
  plugin: Plugin<TConfig>;
  config?: TConfig;
}

export interface ZentaraPluginConfig {
  plugins: PluginWithConfig[];
}
