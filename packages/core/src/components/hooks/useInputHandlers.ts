import { ChangeEvent, RefObject, useCallback, useRef } from 'react';
import { AnyConfig, PluginWithConfig } from '../../types';
import { CreateContextFn } from './useCreateContext';

export const useInputHandlers = (
  pluginsRef: RefObject<PluginWithConfig<AnyConfig>[]>,
  createContext: CreateContextFn,
  setInternalValue: (value: string | ((prev: string) => string)) => void,
  onChange?: (value: string) => void
) => {
  const processingRef = useRef(false);

  const handleChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      processingRef.current = true;
      setInternalValue(newValue);

      if (pluginsRef.current) {
        let processedValue = newValue;
        try {
          for (const pluginWithConfig of pluginsRef.current) {
            if (pluginWithConfig.plugin.onValueChange) {
              processedValue = await pluginWithConfig.plugin.onValueChange(
                processedValue,
                createContext(processedValue, pluginWithConfig)
              );
            }
          }
          if (processedValue !== newValue) {
            setInternalValue(processedValue);
            onChange?.(processedValue);
            return;
          }
        } finally {
          processingRef.current = false;
        }
      }

      onChange?.(newValue);
      processingRef.current = false;
    },
    [createContext, onChange, pluginsRef.current, setInternalValue]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      pluginsRef.current?.forEach((pluginWithConfig) => {
        pluginWithConfig.plugin.onKeyDown?.(
          e,
          createContext(e.currentTarget.value, pluginWithConfig)
        );
      });
    },
    [createContext, pluginsRef.current]
  );

  const handleSelect = useCallback(
    (e: React.SyntheticEvent<HTMLInputElement>) => {
      setInternalValue((prev) => prev);
      pluginsRef.current?.forEach((pluginWithConfig) => {
        pluginWithConfig.plugin.onSelect?.(
          createContext(e.currentTarget.value, pluginWithConfig)
        );
      });
    },
    [createContext, pluginsRef.current, setInternalValue]
  );

  const handleBlur = useCallback(() => {
    pluginsRef.current?.forEach((pluginWithConfig) => {
      pluginWithConfig.plugin.onBlur?.();
    });
  }, [pluginsRef.current]);

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      pluginsRef.current?.forEach((pluginWithConfig) => {
        pluginWithConfig.plugin.onFocus?.(
          createContext(e.currentTarget.value, pluginWithConfig)
        );
      });
    },
    [createContext, pluginsRef.current]
  );

  return {
    handleChange,
    handleKeyDown,
    handleSelect,
    handleBlur,
    handleFocus,
    processingRef,
  };
};
