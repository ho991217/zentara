import { suggestionsPlugin } from '@zentara/plugin-suggestions';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { StyledZentaraInput } from './StyledZentaraInput';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Collapsible } from '@radix-ui/react-collapsible';
import { CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { ChevronDown } from 'lucide-react';

const emojiMap = {
  grinning: '😀',
  heart: '❤️',
  thumbsup: '👍',
  party: '🎉',
  smile: '😊',
  laugh: '😂',
  wink: '😉',
  cool: '😎',
  love: '😍',
  star: '⭐',
} as const;

export const SuggestionsPluginExample = () => {
  const [value, setValue] = useState('');
  const [value2, setValue2] = useState('');
  const [value3, setValue3] = useState('');

  const [variables, setVariables] = useState(['name', 'email', 'age']);
  const [newVariable, setNewVariable] = useState('');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Try typing:</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className='flex flex-col gap-4'>
          <li className='flex flex-col gap-2'>
            <Label htmlFor='emoji-input'>
              <code>:grin</code> for emoji suggestions
            </Label>
            <StyledZentaraInput
              id='emoji-input'
              value={value}
              onChange={setValue}
              plugins={[
                suggestionsPlugin({
                  triggers: [':'],
                  suggestions: Object.keys(emojiMap),
                  renderSuggestion: (suggestion) => {
                    const key = suggestion as keyof typeof emojiMap;
                    return <span>{emojiMap[key]}</span>;
                  },
                  transform: (suggestion) => {
                    const key = suggestion as keyof typeof emojiMap;
                    return `${emojiMap[key]} `;
                  },
                }),
              ]}
            />
          </li>

          <li className='flex flex-col gap-2'>
            <Label htmlFor='template-variable-input'>
              <code>{'{{.'}</code> for template variable suggestions
            </Label>
            <StyledZentaraInput
              id='template-variable-input'
              value={value2}
              onChange={setValue2}
              plugins={[
                suggestionsPlugin({
                  triggers: ['{', '{{', '{{.'],
                  suggestions: variables,
                  transform: (suggestion) => `{{.${suggestion}}}`,
                  renderSuggestion: (suggestion) => (
                    <code>{`{{.${suggestion}}}`}</code>
                  ),
                }),
              ]}
            />
          </li>
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant='ghost'>
                <ChevronDown className='size-3' /> Add variables
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className='p-4 flex flex-col gap-2'>
              <form
                className='flex flex-col gap-2'
                onSubmit={(e) => {
                  e.preventDefault();
                  setVariables((prev) => [...prev, newVariable]);
                }}
              >
                <div className='flex gap-2'>
                  <StyledZentaraInput
                    id='add-variable'
                    className='flex-1'
                    value={newVariable}
                    onChange={setNewVariable}
                  />
                  <Button type='submit'>Add</Button>
                </div>
              </form>
              <ul className='flex gap-2'>
                {variables.map((variable) => (
                  <li
                    key={variable}
                    className='text-xs bg-muted py-1 px-2 rounded-md cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors'
                    onClick={() => {
                      setVariables((prev) =>
                        prev.filter((v) => v !== variable)
                      );
                    }}
                  >
                    {variable}
                  </li>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        </ul>
      </CardContent>
    </Card>
  );
};
