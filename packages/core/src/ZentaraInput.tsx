import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react';
import type {
  ZentaraPluginConfig,
  ZentaraPluginContext,
  SharedPluginState,
  ZentaraPlugin,
} from '@zentara/types';
import './ZentaraInput.css';

export interface ZentaraInputProps {
  value?: string;
  onChange?: (value: string) => void;
  plugins?: ZentaraPluginConfig;
  className?: string;
  placeholder?: string;
  error?: string;
}

export const ZentaraInput = ({
  value: externalValue,
  onChange,
  plugins,
  className,
  placeholder,
  error,
}: ZentaraInputProps) => {
  const [internalValue, setInternalValue] = useState(externalValue || '');
  const sharedState = useRef<SharedPluginState>({});
  const inputRef = useRef<HTMLInputElement>(null);

  const createContext = useCallback(
    (value: string, plugin?: ZentaraPlugin): ZentaraPluginContext => ({
      value,
      setValue: (newValue) => {
        setInternalValue(newValue);
        onChange?.(newValue);
      },
      shared: sharedState.current,
      meta: {
        cursorPosition: inputRef.current?.selectionStart || value.length,
        config: plugin ? plugins?.pluginConfigs?.[plugin.name] : undefined,
      },
    }),
    [onChange, plugins?.pluginConfigs]
  );

  useEffect(() => {
    if (externalValue !== undefined) {
      setInternalValue(externalValue);
    }
  }, [externalValue]);

  useEffect(() => {
    if (plugins?.plugins) {
      for (const plugin of plugins.plugins) {
        if (plugin.init) {
          plugin.init(createContext(internalValue, plugin));
        }
      }
    }
  }, [plugins?.plugins, createContext, internalValue]);

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);

    if (plugins?.plugins) {
      let processedValue = newValue;
      for (const plugin of plugins.plugins) {
        if (plugin.onValueChange) {
          processedValue = await plugin.onValueChange(
            processedValue,
            createContext(processedValue, plugin)
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
    if (plugins?.plugins) {
      for (const plugin of plugins.plugins) {
        if (plugin.onKeyDown) {
          plugin.onKeyDown(e, createContext(internalValue, plugin));
        }
      }
    }
  };

  const handleSelect = () => {
    setInternalValue((prev) => prev);
  };

  return (
    <div className='zentara-input-container'>
      <div className='zentara-input-wrapper'>
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
      </div>
      {error && <span className='zentara-input-error'>{error}</span>}
      <div className='zentara-plugin-container'>
        {plugins?.plugins.map(
          (plugin, index) =>
            plugin.renderSuggestions && (
              <div key={`${plugin.name}-${index}`}>
                {plugin.renderSuggestions(createContext(internalValue, plugin))}
              </div>
            )
        )}
      </div>
    </div>
  );
};
