import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
  type ChangeEvent,
  type KeyboardEvent,
  forwardRef,
  InputHTMLAttributes,
} from 'react';
import {
  isPluginFactory,
  type PluginContext,
  type PluginOrFactory,
  type PluginWithConfig,
  type AnyConfig,
} from '../types';
import '../styles/zentaraInput.css';
import { PluginOverlay } from './PluginOverlay';
import { composeRefs } from '../utils/composeRefs';

export interface InputRenderProps<TConfig = unknown>
  extends PluginContext<TConfig>,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'value'> {}

export interface ZentaraInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  // biome-ignore lint/suspicious/noExplicitAny: Any config is allowed
  plugins?: PluginOrFactory<any>[];
  onChange?: (value: string) => void;
  value?: string;
}

export const ZentaraInput = forwardRef<HTMLInputElement, ZentaraInputProps>(
  function ZentaraInput(props, ref) {
    const { value: externalValue, onChange, plugins, ...inputProps } = props;
    const [internalValue, setInternalValue] = useState(externalValue || '');
    const inputWrapperRef = useRef<HTMLDivElement>(null);
    const processingRef = useRef(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const pluginInstances = useMemo(() => {
      if (!plugins) return [];

      return plugins.map((pluginConfig) => {
        if (isPluginFactory(pluginConfig)) {
          return {
            plugin: pluginConfig.createInstance(),
            config: pluginConfig.config,
          };
        }
        return pluginConfig;
      });
    }, [plugins]);

    const createContext = useCallback(
      function createPluginContext<T = unknown>(
        value: string,
        pluginWithConfig?: PluginWithConfig<T>
      ): PluginContext<T> {
        return {
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
        };
      },
      [onChange]
    );

    const shouldRenderOverlay = useMemo(() => {
      return pluginInstances.some(
        (pluginWithConfig) => pluginWithConfig.plugin.renderOverlay
      );
    }, [pluginInstances]);

    useEffect(() => {
      if (externalValue !== undefined && !processingRef.current) {
        setInternalValue(externalValue);
      }
    }, [externalValue]);

    useEffect(() => {
      pluginInstances.forEach((pluginWithConfig) => {
        pluginWithConfig.plugin.init?.(
          createContext(
            internalValue,
            pluginWithConfig as PluginWithConfig<AnyConfig>
          )
        );
      });

      return () => {
        pluginInstances.forEach((pluginWithConfig) => {
          pluginWithConfig.plugin.destroy?.();
        });
      };
    }, [pluginInstances, createContext, internalValue]);

    const handleChange = useCallback(
      async (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        processingRef.current = true;
        setInternalValue(newValue);

        if (pluginInstances) {
          let processedValue = newValue;
          try {
            for (const pluginWithConfig of pluginInstances) {
              if (pluginWithConfig.plugin.onValueChange) {
                processedValue = await pluginWithConfig.plugin.onValueChange(
                  processedValue,
                  createContext(
                    processedValue,
                    pluginWithConfig as PluginWithConfig<AnyConfig>
                  )
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
      [pluginInstances, createContext, onChange]
    );

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        pluginInstances.forEach((pluginWithConfig) => {
          pluginWithConfig.plugin.onKeyDown?.(
            e,
            createContext(
              internalValue,
              pluginWithConfig as PluginWithConfig<AnyConfig>
            )
          );
        });
      },
      [pluginInstances, createContext, internalValue]
    );

    const handleSelect = useCallback(() => {
      setInternalValue((prev) => prev);

      pluginInstances.forEach((pluginWithConfig) => {
        pluginWithConfig.plugin.onSelect?.(
          createContext(
            internalValue,
            pluginWithConfig as PluginWithConfig<AnyConfig>
          )
        );
      });
    }, [pluginInstances, createContext, internalValue]);

    const handleBlur = useCallback(() => {
      pluginInstances.forEach((pluginWithConfig) => {
        pluginWithConfig.plugin.onBlur?.();
      });
    }, [pluginInstances]);

    const handleFocus = useCallback(() => {
      pluginInstances.forEach((pluginWithConfig) => {
        pluginWithConfig.plugin.onFocus?.(
          createContext(
            internalValue,
            pluginWithConfig as PluginWithConfig<AnyConfig>
          )
        );
      });
    }, [pluginInstances, createContext, internalValue]);

    const customInputRenderers = useMemo(
      () => pluginInstances.filter((p) => p.plugin.renderInput),
      [pluginInstances]
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
        <div className='zentara-input-wrapper' ref={inputWrapperRef}>
          {customInputRenderer ? (
            customInputRenderer({
              ...createContext(internalValue),
              onChange: handleChange,
              onKeyDown: handleKeyDown,
              onSelect: handleSelect,
              onBlur: handleBlur,
              onFocus: handleFocus,
              className: `zentara-input ${inputProps.className || ''}`,
              ...inputProps,
            })
          ) : (
            <input
              ref={composeRefs(ref, inputRef)}
              type='text'
              value={internalValue}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onSelect={handleSelect}
              onBlur={handleBlur}
              onFocus={handleFocus}
              className={`zentara-input ${inputProps.className || ''}`}
              {...inputProps}
            />
          )}
        </div>
        {shouldRenderOverlay && (
          <PluginOverlay
            pluginInstance={pluginInstances[0]}
            internalValue={internalValue}
            createContext={createContext}
            anchorEl={inputWrapperRef.current}
          />
        )}
      </div>
    );
  }
);
