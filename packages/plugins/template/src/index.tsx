import { useState, useEffect } from 'react';
import type { ZentaraPlugin } from '@zentara/types';
import './template.css';

interface TemplatePluginConfig {
  variables?: string[];
  triggerChar?: string;
  maxSuggestions?: number;
}

const defaultConfig: TemplatePluginConfig = {
  variables: [],
  triggerChar: '{{.',
  maxSuggestions: 5,
};

interface PluginState {
  isOpen: boolean;
  selectedIndex: number;
}

const initialState: PluginState = {
  isOpen: false,
  selectedIndex: -1,
};

let pluginState = { ...initialState };
let subscribers: Array<() => void> = [];

const notify = () => {
  for (const subscriber of subscribers) {
    subscriber();
  }
};

const setState = (newState: Partial<PluginState>) => {
  pluginState = { ...pluginState, ...newState };
  notify();
};

export const templatePlugin: ZentaraPlugin<
  'template-autocomplete',
  TemplatePluginConfig
> = {
  name: 'template-autocomplete',

  onValueChange: (value, context) => {
    const config = {
      ...defaultConfig,
      ...(context.meta?.config || {}),
    };

    if (value.endsWith(config.triggerChar)) {
      setState({ isOpen: true, selectedIndex: 0 });
    }

    return value;
  },

  onKeyDown: (event, context) => {
    const config = {
      ...defaultConfig,
      ...(context.meta?.config || {}),
    };

    const value = context.value;
    const cursorIndex = context.meta?.cursorPosition || value.length;
    const beforeCursor = value.slice(0, cursorIndex);
    const triggerIndex = beforeCursor.lastIndexOf(config.triggerChar);

    if (triggerIndex === -1) {
      setState({ isOpen: false, selectedIndex: -1 });
      return;
    }

    const searchText = beforeCursor.slice(
      triggerIndex + config.triggerChar.length
    );

    if (searchText.includes('}')) {
      setState({ isOpen: false, selectedIndex: -1 });
      return;
    }

    const suggestions = (config.variables || [])
      .filter(
        (varName) =>
          searchText === '' ||
          varName.toLowerCase().includes(searchText.toLowerCase())
      )
      .slice(0, config.maxSuggestions);

    if (suggestions.length === 0) {
      setState({ isOpen: false, selectedIndex: -1 });
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        setState({
          selectedIndex: Math.min(
            pluginState.selectedIndex + 1,
            suggestions.length - 1
          ),
        });
        event.preventDefault();
        break;
      case 'ArrowUp':
        setState({
          selectedIndex: Math.max(pluginState.selectedIndex - 1, 0),
        });
        event.preventDefault();
        break;
      case 'Enter':
        if (pluginState.selectedIndex >= 0) {
          const selectedVar = suggestions[pluginState.selectedIndex];
          if (selectedVar) {
            const newValue = `${value.slice(
              0,
              triggerIndex
            )}{{.${selectedVar}}}${value.slice(cursorIndex)}`;
            context.setValue(newValue);
            setState({ isOpen: false, selectedIndex: -1 });
            event.preventDefault();
          }
        }
        break;
      case 'Escape':
        setState({ isOpen: false, selectedIndex: -1 });
        event.preventDefault();
        break;
    }
  },

  renderSuggestions: (context) => {
    const [, forceUpdate] = useState({});

    useEffect(() => {
      const subscriber = () => forceUpdate({});
      subscribers.push(subscriber);
      return () => {
        subscribers = subscribers.filter((s) => s !== subscriber);
      };
    }, []);

    if (!pluginState.isOpen) return null;

    const config = {
      ...defaultConfig,
      ...(context.meta?.config || {}),
    };

    const value = context.value;
    const cursorIndex = context.meta?.cursorPosition || value.length;
    const beforeCursor = value.slice(0, cursorIndex);
    const triggerIndex = beforeCursor.lastIndexOf(config.triggerChar);

    if (triggerIndex === -1) return null;

    const searchText = beforeCursor.slice(
      triggerIndex + config.triggerChar.length
    );

    if (searchText.includes('}')) return null;

    const suggestions = (config.variables || [])
      .filter(
        (varName) =>
          searchText === '' ||
          varName.toLowerCase().includes(searchText.toLowerCase())
      )
      .slice(0, config.maxSuggestions);

    if (suggestions.length === 0) return null;

    return (
      <div className='zentara-template-suggestions'>
        {suggestions.map((varName, index) => (
          <button
            key={varName}
            type='button'
            onClick={() => {
              const newValue = `${value.slice(
                0,
                triggerIndex
              )}{{.${varName}}}${value.slice(cursorIndex)}`;
              context.setValue(newValue);
              setState({ isOpen: false, selectedIndex: -1 });
            }}
            className='zentara-template-suggestion-item'
            data-selected={
              index === pluginState.selectedIndex ? 'true' : 'false'
            }
          >
            <code className='zentara-template-suggestion-code'>{`{{.${varName}}}`}</code>
          </button>
        ))}
      </div>
    );
  },
};
