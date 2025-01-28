import type { ZentaraPlugin } from '@zentara/types';
import emojiData from './emoji-data.json';
import { useState, useEffect } from 'react';
import './emoji.css';

interface EmojiPluginConfig {
  triggerChar?: string;
  maxSuggestions?: number;
}

const defaultConfig: EmojiPluginConfig = {
  triggerChar: ':',
  maxSuggestions: 5,
};

let pluginState = { isOpen: false, selectedIndex: -1 };
let subscribers: Array<() => void> = [];

const notify = () => {
  for (const subscriber of subscribers) {
    subscriber();
  }
};

const setState = (newState: Partial<typeof pluginState>) => {
  pluginState = { ...pluginState, ...newState };
  notify();
};

export const emojiPlugin: ZentaraPlugin<'emoji', EmojiPluginConfig> = {
  name: 'emoji',

  onValueChange: (value, context) => {
    const config = {
      ...defaultConfig,
      ...(context.meta?.config || {}),
    };

    const cursorIndex = context.meta?.cursorPosition || value.length;
    const beforeCursor = value.slice(0, cursorIndex);
    const lastColonIndex = beforeCursor.lastIndexOf(config.triggerChar);

    if (
      lastColonIndex !== -1 &&
      !beforeCursor.slice(lastColonIndex).includes(' ')
    ) {
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
    const lastColonIndex = beforeCursor.lastIndexOf(config.triggerChar);

    if (lastColonIndex === -1) {
      setState({ isOpen: false, selectedIndex: -1 });
      return;
    }

    const searchText = beforeCursor.slice(lastColonIndex + 1);

    if (searchText.includes(' ')) {
      setState({ isOpen: false, selectedIndex: -1 });
      return;
    }

    const suggestions = emojiData
      .filter((emoji) =>
        emoji.aliases.some((alias) =>
          alias.toLowerCase().includes(searchText.toLowerCase())
        )
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
          const selectedEmoji = suggestions[pluginState.selectedIndex];
          if (selectedEmoji) {
            const newValue = `${value.slice(0, lastColonIndex)}${
              selectedEmoji.emoji
            } ${value.slice(cursorIndex)}`;
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
    const lastColonIndex = beforeCursor.lastIndexOf(config.triggerChar);

    if (lastColonIndex === -1) return null;

    const searchText = beforeCursor.slice(lastColonIndex + 1);

    if (searchText.includes(' ')) return null;

    const suggestions = emojiData
      .filter((emoji) =>
        emoji.aliases.some((alias) =>
          alias.toLowerCase().includes(searchText.toLowerCase())
        )
      )
      .slice(0, config.maxSuggestions);

    if (suggestions.length === 0) return null;

    return (
      <div className='zentara-emoji-suggestions'>
        {suggestions.map((emoji, index) => (
          <button
            key={emoji.aliases[0]}
            type='button'
            onClick={() => {
              const newValue = `${value.slice(0, lastColonIndex)}${
                emoji.emoji
              } ${value.slice(cursorIndex)}`;
              context.setValue(newValue);
              setState({ isOpen: false, selectedIndex: -1 });
            }}
            className='zentara-emoji-suggestion-item'
            data-selected={
              index === pluginState.selectedIndex ? 'true' : 'false'
            }
          >
            <span className='zentara-emoji-suggestion-emoji'>
              {emoji.emoji}
            </span>
            <span className='zentara-emoji-suggestion-alias'>{`:${emoji.aliases[0]}:`}</span>
          </button>
        ))}
      </div>
    );
  },
};
