# Zentara

[English](README.md) | [한국어](README.ko.md)

Zentara는 React 기반의 강력한 입력 컴포넌트 라이브러리입니다. 이모지 선택, 템플릿 변수 자동완성 등 다양한 플러그인을 지원합니다.

## 특징

- 🔌 플러그인 기반 아키텍처
- 🎯 타입스크립트 지원
- 🎨 커스터마이징 가능한 스타일
- 📦 작은 번들 크기
- ⚡ 빠른 성능
- 📚 React-hook-form 호환

## 설치

```bash
npm install @zentara/core
# or
yarn add @zentara/core
# or
pnpm add @zentara/core
```

## 사용 방법

```tsx
import { ZentaraInput } from '@zentara/core';
import { suggestionsPlugin } from '@zentara/plugin-suggestions';

function App() {
  const [value, setValue] = useState('');

  return (
    <ZentaraInput
      value={value}
      onChange={setValue}
      plugins={[
        {
          plugin: suggestionsPlugin,
          config: {
            rules: [
              {
                // 이모지 제안
                triggers: [':'],
                suggestions: ['grinning', 'heart', 'thumbsup', 'party'],
                transform: (suggestion) => `${emojiMap[suggestion]} `,
                renderSuggestion: (suggestion) => (
                  <>
                    <span className='zentara-suggestion-primary'>
                      {emojiMap[suggestion]}
                    </span>
                    <span className='zentara-suggestion-secondary'>
                      {`:${suggestion}:`}
                    </span>
                  </>
                ),
              },
              {
                // 템플릿 변수 제안
                triggers: ['{{.'],
                suggestions: ['name', 'email', 'age'],
                transform: (suggestion) => `{{.${suggestion}}}`,
                renderSuggestion: (suggestion) => (
                  <code className='zentara-suggestion-code'>
                    {`{{.${suggestion}}}`}
                  </code>
                ),
              },
              {
                // 이슈 참조 제안
                triggers: [/#\d*$/, /[Ii]ssue-\d*$/],
                suggestions: ['123: 버그 수정', '456: 기능 요청'],
                transform: (suggestion) => {
                  const id = suggestion.split(':')[0];
                  return `#${id} `;
                },
                renderSuggestion: (suggestion) => {
                  const [id, title] = suggestion.split(':');
                  return (
                    <>
                      <span className='zentara-suggestion-primary'>#{id}</span>
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
  );
}

const emojiMap = {
  grinning: '😀',
  heart: '❤️',
  thumbsup: '👍',
  party: '🎉',
};
```

## 플러그인

### 제안 플러그인 (@zentara/plugin-suggestions)

다양한 용도로 설정할 수 있는 유연한 제안 플러그인:

- 다중 트리거 패턴 (문자열 또는 정규식)
- 커스텀 제안 목록
- 선택된 제안의 변환 방식 커스터마이징
- 제안 항목의 렌더링 커스터마이징

설정 옵션:

```ts
interface SuggestionRule {
  // 제안 팝업을 트리거하는 문자열 또는 정규식 패턴
  triggers: (string | RegExp)[];
  // 검색할 제안 목록
  suggestions: string[];
  // 선택된 제안을 최종 텍스트로 변환
  transform: (suggestion: string) => string;
  // 선택적으로 제안 항목의 렌더링을 커스터마이징
  renderSuggestion?: (suggestion: string) => JSX.Element;
}

interface SuggestionsPluginConfig {
  // 제안 규칙 목록
  rules: SuggestionRule[];
  // 최대 제안 개수
  maxSuggestions?: number;
}
```

## 개발

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 빌드
pnpm build

# 린트
pnpm lint

# 포맷팅
pnpm format
```

## 프로젝트 구조

```
packages/
  ├── core/          # 메인 컴포넌트
  ├── types/         # 타입 정의
  ├── plugins/       # 플러그인
  │   └── suggestions/  # 제안 플러그인 (이모지 & 템플릿)
  └── example/       # 예제 프로젝트
```

## 기여하기

프로젝트에 기여하고 싶으신가요? [기여 가이드](CONTRIBUTING.ko.md)를 확인해주세요.

## 라이선스

MIT © [HoYeon Lee](https://github.com/ho991217)
