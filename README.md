# Zentara

[English](README.md) | [한국어](README.ko.md)

A powerful React-based input component library with support for plugins like emoji selection and template variable autocompletion.

## Features

- 🔌 Plugin-based architecture
- 🎯 TypeScript support
- 🎨 Customizable styling
- 📦 Small bundle size
- ⚡ High performance
- 📚 React-hook-form compatibility

## Installation

```bash
npm install @zentara/core
# or
yarn add @zentara/core
# or
pnpm add @zentara/core
```

## Usage

```tsx
import { ZentaraInput } from '@zentara/core';
import { emojiPlugin } from '@zentara/plugin-emoji';
import { templatePlugin } from '@zentara/plugin-template';

function App() {
  const [value, setValue] = useState('');

  return (
    <ZentaraInput
      value={value}
      onChange={setValue}
      plugins={{
        plugins: [emojiPlugin, templatePlugin],
        pluginConfigs: {
          emoji: {
            triggerChar: ':',
            maxSuggestions: 5,
          },
          'template-autocomplete': {
            variables: ['name', 'email', 'age'],
            triggerChar: '{{.',
            maxSuggestions: 5,
          },
        },
      }}
    />
  );
}
```

## Plugins

### Emoji Plugin (@zentara/plugin-emoji)

- Emoji search and selection
- Keyboard navigation support
- Customizable trigger character

### Template Plugin (@zentara/plugin-template)

- Template variable autocompletion
- Keyboard navigation support
- Customizable variable list

## Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build
pnpm build

# Lint
pnpm lint

# Format
pnpm format
```

## Project Structure

```
packages/
  ├── core/          # Main component
  ├── types/         # Type definitions
  ├── plugins/       # Plugins
  │   ├── emoji/     # Emoji plugin
  │   └── template/  # Template plugin
  └── example/       # Example project
```

## Contributing

Want to contribute? Check out our [contribution guide](CONTRIBUTING.md).

## License

MIT © [HoYeon Lee](https://github.com/ho991217)
