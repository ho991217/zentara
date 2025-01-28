import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react';
import type { PluginContext, PluginWithConfig } from './types';
import './ZentaraInput.css';

export interface ZentaraInputProps<TConfig = unknown> {
  value?: string;
  onChange?: (value: string) => void;
  plugins?: PluginWithConfig<TConfig>[];
  className?: string;
  placeholder?: string;
  error?: string;
}

export const ZentaraInput = <TConfig = unknown,>({
  value: externalValue,
  onChange,
  plugins,
  className,
  placeholder,
  error,
}: ZentaraInputProps<TConfig>) => {
  const [internalValue, setInternalValue] = useState(externalValue || '');
  const sharedState = useRef<Record<string, unknown>>({});
  const inputRef = useRef<HTMLInputElement>(null);

  const createContext = useCallback(
    <TConfig,>(
      value: string,
      pluginWithConfig?: PluginWithConfig<TConfig>
    ): PluginContext<TConfig> => ({
      value,
      setValue: (newValue) => {
        setInternalValue(newValue);
        onChange?.(newValue);
      },
      cursor: {
        start: inputRef.current?.selectionStart ?? value.length,
        end: inputRef.current?.selectionEnd ?? value.length,
      },
      inputRef,
      config: pluginWithConfig?.config,
      shared: sharedState.current,
    }),
    [onChange]
  );

  useEffect(() => {
    if (externalValue !== undefined) {
      setInternalValue(externalValue);
    }
  }, [externalValue]);

  useEffect(() => {
    if (plugins) {
      for (const pluginWithConfig of plugins) {
        if (pluginWithConfig.plugin.init) {
          pluginWithConfig.plugin.init(
            createContext(internalValue, pluginWithConfig)
          );
        }
      }
    }
  }, [plugins, createContext, internalValue]);

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);

    if (plugins) {
      let processedValue = newValue;
      for (const pluginWithConfig of plugins) {
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
    }

    onChange?.(newValue);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (plugins) {
      for (const pluginWithConfig of plugins) {
        if (pluginWithConfig.plugin.onKeyDown) {
          pluginWithConfig.plugin.onKeyDown(
            e,
            createContext(internalValue, pluginWithConfig)
          );
        }
      }
    }
  };

  const handleSelect = () => {
    setInternalValue((prev) => prev);
  };

  const customInputRenderer = plugins?.find((p) => p.plugin.renderInput)?.plugin
    .renderInput;

  return (
    <div className='zentara-input-container'>
      <div className='zentara-input-wrapper'>
        {customInputRenderer ? (
          customInputRenderer({
            ...createContext(internalValue),
            onChange: handleChange,
            onKeyDown: handleKeyDown,
            onSelect: handleSelect,
            className: `zentara-input ${className || ''}`,
            placeholder,
          })
        ) : (
          <input
            ref={inputRef}
            type='text'
            value={internalValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onSelect={handleSelect}
            className={`zentara-input ${className || ''}`}
            placeholder={placeholder}
          />
        )}
      </div>
      {error && <span className='zentara-input-error'>{error}</span>}
      <div className='zentara-plugin-overlay'>
        {plugins?.map(
          (pluginWithConfig, index) =>
            pluginWithConfig.plugin.renderOverlay && (
              <div key={`${pluginWithConfig.plugin.name}-${index}`}>
                {pluginWithConfig.plugin.renderOverlay(
                  createContext(internalValue, pluginWithConfig)
                )}
              </div>
            )
        )}
      </div>
    </div>
  );
};
