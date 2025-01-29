import {
  useEffect,
  useRef,
  useState,
  useMemo,
  forwardRef,
  InputHTMLAttributes,
} from 'react';
import { type PluginContext, type PluginOrFactory } from '../types';
import '../styles/zentaraInput.css';
import { PluginOverlay } from './PluginOverlay';
import { composeRefs } from '../utils/composeRefs';
import { usePlugins } from './hooks/usePlugins';
import { useCreateContext } from './hooks/useCreateContext';
import { useInputHandlers } from './hooks/useInputHandlers';

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
    const inputRef = useRef<HTMLInputElement>(null);

    const pluginsRef = usePlugins(plugins);
    const createContext = useCreateContext(
      onChange,
      setInternalValue,
      inputRef
    );
    const {
      handleChange,
      handleKeyDown,
      handleSelect,
      handleBlur,
      handleFocus,
      processingRef,
    } = useInputHandlers(pluginsRef, createContext, setInternalValue, onChange);

    useEffect(() => {
      if (externalValue !== undefined && !processingRef.current) {
        setInternalValue(externalValue);
      }
    }, [externalValue, processingRef.current]);

    useEffect(() => {
      pluginsRef.current.forEach((pluginWithConfig) => {
        pluginWithConfig.plugin.init?.(
          createContext(internalValue, pluginWithConfig)
        );
      });
    }, [createContext, internalValue, pluginsRef.current]);

    const customInputRenderers = useMemo(
      () => pluginsRef.current.filter((p) => p.plugin.renderInput),
      [pluginsRef.current]
    );

    if (
      customInputRenderers.length > 1 &&
      process.env.NODE_ENV !== 'production'
    ) {
      console.warn(
        `Multiple plugins with renderInput detected. Only the first one will be used: ${customInputRenderers
          .map((p) => p.plugin.name)
          .join(', ')}`
      );
    }

    const customInputRenderer = customInputRenderers[0]?.plugin.renderInput;

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
        {pluginsRef.current.map(
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
