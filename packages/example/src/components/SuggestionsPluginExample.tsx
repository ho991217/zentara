import { suggestionsPlugin } from '@zentara/plugin-suggestions';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { StyledZentaraInput } from './StyledZentaraInput';
import { Label } from './ui/label';

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

const variables = [
  'name',
  'email',
  'age',
  'address',
  'phone',
  'company',
  'position',
  'department',
] as const;

const issues = [
  { id: '123', title: '버그 수정: 입력 창 포커스 문제' },
  { id: '456', title: '기능 추가: 다크 모드 지원' },
  { id: '789', title: '문서 업데이트: API 가이드' },
  { id: '101', title: '성능 개선: 렌더링 최적화' },
] as const;

export const SuggestionsPluginExample = () => {
  const [value, setValue] = useState('');
  const [value2, setValue2] = useState('');
  const [value3, setValue3] = useState('');
  return (
    <Card>
      <CardHeader>
        <CardTitle>Suggestions Plugin Example</CardTitle>
      </CardHeader>
      <CardContent>
        <h2>Try typing:</h2>
        <ul>
          <li>
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
          <li>
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
                  suggestions: [...variables],
                  transform: (suggestion) => `{{.${suggestion}}}`,
                  renderSuggestion: (suggestion) => (
                    <code>{`{{.${suggestion}}}`}</code>
                  ),
                }),
              ]}
            />
          </li>
          <li>
            <Label htmlFor='issue-input'>
              <code>#123</code> or <code>issue-456</code> for issue references
            </Label>
            <StyledZentaraInput
              id='issue-input'
              value={value3}
              onChange={setValue3}
              plugins={[
                suggestionsPlugin({
                  triggers: ['#', 'issue-'],
                  suggestions: issues.map((issue) => issue.id),
                  renderSuggestion: (suggestion) => (
                    <span>{`#${suggestion}`}</span>
                  ),
                  transform: (suggestion) => `#${suggestion}`,
                }),
              ]}
            />
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};
