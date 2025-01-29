import { RefObject, useCallback } from 'react';
import { PluginContext, PluginWithConfig } from '../../types';

export interface CreateContextFn {
  <T = unknown>(
    value: string,
    pluginWithConfig?: PluginWithConfig<T>
  ): PluginContext<T>;
}

export const useCreateContext = (
  onChange: ((value: string) => void) | undefined,
  setInternalValue: (value: string | ((prev: string) => string)) => void,
  inputRef: RefObject<HTMLInputElement>
): CreateContextFn => {
  return useCallback(
    (value: string, pluginWithConfig?: PluginWithConfig<unknown>) => ({
      value,
      setValue: (newValue: string) => {
        setInternalValue(newValue);
        onChange?.(newValue);
      },
      cursor: {
        start: inputRef.current?.selectionStart ?? value.length,
        end: inputRef.current?.selectionEnd ?? value.length,
      },
      inputRef,
      config: pluginWithConfig?.config,
    }),
    [onChange, setInternalValue, inputRef]
  ) as CreateContextFn;
};
