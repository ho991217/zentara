import { useState } from 'react';
import { ZentaraInput } from '@zentara/core';
import { suggestionsPlugin } from '@zentara/plugin-suggestions';
import './App.css';

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

function App() {
  const [value, setValue] = useState('');

  return (
    <div className='container'>
      <h1>Zentara Example</h1>
      <div className='input-container'>
        <h2>Try typing:</h2>
        <ul>
          <li>
            <code>:grin</code> for emoji suggestions
          </li>
          <li>
            <code>{'{{.'}</code> for template variable suggestions
          </li>
          <li>
            <code>#123</code> or <code>issue-456</code> for issue references
          </li>
        </ul>
        <ZentaraInput
          value={value}
          onChange={setValue}
          plugins={[
            {
              plugin: suggestionsPlugin,
              config: {
                rules: [
                  {
                    // Emoji suggestions
                    triggers: [':'],
                    suggestions: Object.keys(emojiMap),
                    transform: (suggestion: string) => {
                      const key = suggestion as keyof typeof emojiMap;
                      return `${emojiMap[key]} `;
                    },
                    renderSuggestion: (suggestion: string) => {
                      const key = suggestion as keyof typeof emojiMap;
                      return (
                        <>
                          <span className='zentara-suggestion-primary'>
                            {emojiMap[key]}
                          </span>
                          <span className='zentara-suggestion-secondary'>
                            {`:${suggestion}:`}
                          </span>
                        </>
                      );
                    },
                  },
                  {
                    // Template variable suggestions
                    triggers: ['{', '{{', '{{.'],
                    suggestions: [...variables],
                    transform: (suggestion: string) => `{{.${suggestion}}}`,
                    renderSuggestion: (suggestion: string) => (
                      <code className='zentara-suggestion-code'>
                        {`{{.${suggestion}}}`}
                      </code>
                    ),
                  },
                  {
                    // Issue reference suggestions
                    triggers: [/#\d*$/, /[Ii]ssue-\d*$/],
                    suggestions: issues.map(
                      (issue) => `${issue.id}: ${issue.title}`
                    ),
                    transform: (suggestion: string) => {
                      const id = suggestion.split(':')[0];
                      return `#${id} `;
                    },
                    renderSuggestion: (suggestion: string) => {
                      const [id, title] = suggestion.split(':');
                      return (
                        <>
                          <span className='zentara-suggestion-primary'>
                            #{id}
                          </span>
                          <span className='zentara-suggestion-secondary'>
                            {title}
                          </span>
                        </>
                      );
                    },
                  },
                ],
                maxSuggestions: 5,
              },
            },
          ]}
        />
      </div>
    </div>
  );
}

export default App;
