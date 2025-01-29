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
    const pluginInstancesRef = useRef<PluginWithConfig<AnyConfig>[]>([]);

    // Create plugin instances
    if (
      plugins &&
      (!pluginInstancesRef.current || pluginInstancesRef.current.length === 0)
    ) {
      pluginInstancesRef.current = plugins.map((pluginConfig) => {
        if (isPluginFactory(pluginConfig)) {
          return {
            plugin: pluginConfig.createInstance(),
            config: pluginConfig.config,
          };
        }
        return pluginConfig;
      });
    }

    // cleanup on unmount
    useEffect(() => {
      return () => {
        pluginInstancesRef.current.forEach((pluginWithConfig) => {
          pluginWithConfig.plugin.destroy?.();
        });
        pluginInstancesRef.current = [];
      };
    }, []);

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

    useEffect(() => {
      if (externalValue !== undefined && !processingRef.current) {
        setInternalValue(externalValue);
      }
    }, [externalValue]);

    useEffect(() => {
      pluginInstancesRef.current.forEach((pluginWithConfig) => {
        pluginWithConfig.plugin.init?.(
          createContext(
            internalValue,
            pluginWithConfig as PluginWithConfig<AnyConfig>
          )
        );
      });
    }, [createContext, internalValue]);

    const handleChange = useCallback(
      async (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        processingRef.current = true;
        setInternalValue(newValue);

        if (pluginInstancesRef.current) {
          let processedValue = newValue;
          try {
            for (const pluginWithConfig of pluginInstancesRef.current) {
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
      [createContext, onChange]
    );

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        pluginInstancesRef.current.forEach((pluginWithConfig) => {
          pluginWithConfig.plugin.onKeyDown?.(
            e,
            createContext(
              internalValue,
              pluginWithConfig as PluginWithConfig<AnyConfig>
            )
          );
        });
      },
      [createContext, internalValue]
    );

    const handleSelect = useCallback(() => {
      setInternalValue((prev) => prev);

      pluginInstancesRef.current.forEach((pluginWithConfig) => {
        pluginWithConfig.plugin.onSelect?.(
          createContext(
            internalValue,
            pluginWithConfig as PluginWithConfig<AnyConfig>
          )
        );
      });
    }, [createContext, internalValue]);

    const handleBlur = useCallback(() => {
      pluginInstancesRef.current.forEach((pluginWithConfig) => {
        pluginWithConfig.plugin.onBlur?.();
      });
    }, []);

    const handleFocus = useCallback(() => {
      pluginInstancesRef.current.forEach((pluginWithConfig) => {
        pluginWithConfig.plugin.onFocus?.(
          createContext(
            internalValue,
            pluginWithConfig as PluginWithConfig<AnyConfig>
          )
        );
      });
    }, [createContext, internalValue]);

    const customInputRenderers = useMemo(
      () => pluginInstancesRef.current.filter((p) => p.plugin.renderInput),
      []
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
        {pluginInstancesRef.current.map(
          (pluginInstance) =>
            pluginInstance.plugin.renderOverlay && (
              <PluginOverlay
                key={`overlay-${pluginInstance.plugin.name}`}
                pluginInstance={pluginInstance}
                internalValue={internalValue}
                createContext={createContext}
                anchorEl={inputWrapperRef.current}
              />
            )
        )}
      </div>
    );
  }
);
