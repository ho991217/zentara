import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
  memo,
  type ChangeEvent,
  type KeyboardEvent,
  type CSSProperties,
} from 'react';
import type { PluginContext, PluginWithConfig } from '../types';
import '../styles/zentaraInput.css';

export interface ZentaraInputProps<TConfig = unknown> {
  value?: string;
  onChange?: (value: string) => void;
  plugins?: PluginWithConfig<TConfig>[];
  className?: string;
  placeholder?: string;
  error?: string;
  style?: CSSProperties;
}

type PluginOverlayProps<TConfig> = {
  plugins: PluginWithConfig<TConfig>[];
  internalValue: string;
  createContext: <T>(
    value: string,
    pluginWithConfig?: PluginWithConfig<T>
  ) => PluginContext<T>;
};

const PluginOverlay = memo(function PluginOverlay<TConfig>({
  plugins,
  internalValue,
  createContext,
}: PluginOverlayProps<TConfig>) {
  return (
    <div className='zentara-plugin-overlay'>
      {plugins.map(
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
  );
});

export function ZentaraInput<TConfig = unknown>({
  value: externalValue,
  onChange,
  plugins,
  className,
  placeholder,
  error,
  style,
}: ZentaraInputProps<TConfig>) {
  const [internalValue, setInternalValue] = useState(externalValue || '');
  const sharedState = useRef<Record<string, unknown>>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const processingRef = useRef(false);

  const createContext = useMemo(
    () =>
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
    if (externalValue !== undefined && !processingRef.current) {
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

  const handleChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      processingRef.current = true;
      setInternalValue(newValue);

      if (plugins) {
        let processedValue = newValue;
        try {
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
        } finally {
          processingRef.current = false;
        }
      }

      onChange?.(newValue);
      processingRef.current = false;
    },
    [plugins, createContext, onChange]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
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
    },
    [plugins, createContext, internalValue]
  );

  const handleSelect = useCallback(() => {
    setInternalValue((prev) => prev);
  }, []);

  const customInputRenderers = useMemo(
    () => plugins?.filter((p) => p.plugin.renderInput),
    [plugins]
  );

  if (
    customInputRenderers &&
    customInputRenderers.length > 1 &&
    process.env.NODE_ENV !== 'production'
  ) {
    console.warn(
      `Multiple plugins with renderInput detected. Only the first one will be used: ${customInputRenderers
        .map((p) => p.plugin.name)
        .join(', ')}`
    );
  }

  const customInputRenderer = customInputRenderers?.[0]?.plugin.renderInput;

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
            style,
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
            style={style}
          />
        )}
      </div>
      {error && <span className='zentara-input-error'>{error}</span>}
      {plugins && (
        <PluginOverlay
          // @ts-expect-error FIXME: Fix this
          plugins={plugins}
          internalValue={internalValue}
          createContext={createContext}
        />
      )}
    </div>
  );
}
