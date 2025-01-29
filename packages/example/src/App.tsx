import { useState } from 'react';
import { ZentaraInput } from '@zentara/core';
import { suggestionsPlugin } from '@zentara/plugin-suggestions';
import type { SuggestionsPluginConfig } from '@zentara/plugin-suggestions';
import './App.css';
import '@zentara/core/dist/index.css';
import '@zentara/plugin-suggestions/dist/index.css';

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

// const issues = [
//   { id: '123', title: '버그 수정: 입력 창 포커스 문제' },
//   { id: '456', title: '기능 추가: 다크 모드 지원' },
//   { id: '789', title: '문서 업데이트: API 가이드' },
//   { id: '101', title: '성능 개선: 렌더링 최적화' },
// ] as const;

function App() {
  const [value, setValue] = useState('');
  const [value2, setValue2] = useState('');

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
        <ZentaraInput<SuggestionsPluginConfig>
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
        <ZentaraInput<SuggestionsPluginConfig>
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
      </div>
    </div>
  );
}

export default App;
