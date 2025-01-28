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

## 플러그인

### 이모지 플러그인 (@zentara/plugin-emoji)

- 이모지 검색 및 선택 기능
- 키보드 네비게이션 지원
- 커스터마이징 가능한 트리거 문자

### 템플릿 플러그인 (@zentara/plugin-template)

- 템플릿 변수 자동완성
- 키보드 네비게이션 지원
- 커스터마이징 가능한 변수 목록

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
  │   ├── emoji/     # 이모지 플러그인
  │   └── template/  # 템플릿 플러그인
  └── example/       # 예제 프로젝트
```

## 기여하기

프로젝트에 기여하고 싶으신가요? [기여 가이드](CONTRIBUTING.ko.md)를 확인해주세요.

## 라이선스

MIT © [HoYeon Lee](https://github.com/ho991217)
