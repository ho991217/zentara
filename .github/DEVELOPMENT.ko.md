# 개발 가이드

## 배포 프로세스

[Changesets](https://github.com/changesets/changesets)를 사용하여 버전 관리와 패키지 배포를 진행합니다.

### Changeset 추가하기

릴리즈가 필요한 변경사항을 만들었다면, changeset을 추가하세요:

```bash
pnpm changeset
```

다음과 같은 과정을 거치게 됩니다:

1. 변경한 패키지 선택
2. 버전 변경 유형 선택 (major/minor/patch)
3. 변경사항에 대한 설명 작성

작성한 설명은 패키지의 changelog와 릴리즈 노트에 사용됩니다.

### Changeset 설명 예시

```
# 새로운 기능
suggestion 아이템을 커스터마이징할 수 있는 `renderSuggestion` prop 추가

# 버그 수정
suggestion 목록의 키보드 네비게이션 문제 수정

# 문서 업데이트
npm/pnpm 예시를 포함한 설치 가이드 업데이트

# 호환성이 깨지는 변경
deprecated된 `autoComplete` prop 제거. 대신 `suggestions` 사용
```

### 배포 프로세스

1. 변경사항과 changeset을 포함한 PR 생성
2. PR이 main 브랜치에 머지되면:
   - changeset이 있는 경우 "Version Packages" PR이 자동으로 생성됨
   - 이 PR은 패키지 버전과 changelog를 업데이트
3. "Version Packages" PR을 머지하면:
   - 버전과 changelog가 업데이트됨
   - git 태그가 생성됨
   - npm에 패키지가 배포됨
   - GitHub 릴리즈가 생성됨

### 사전 준비사항

1. `@zentara` organization에 대한 npm 접근 권한이 있어야 함
2. npm에 로그인되어 있어야 함 (`npm login`)
3. 필요한 GitHub 권한이 있어야 함

### 패키지 설치

```bash
# npm 레지스트리에서 설치
npm install @zentara/core
# 또는
pnpm add @zentara/core
```

### 주의사항

- 릴리즈가 필요한 변경사항을 만들 때는 항상 changeset을 포함하세요
- 시맨틱 버저닝 가이드라인을 따르세요:
  - MAJOR: 호환성이 깨지는 변경
  - MINOR: 새로운 기능 (하위 호환성 유지)
  - PATCH: 버그 수정 (하위 호환성 유지)
- changeset을 생성하기 전에 변경사항을 테스트하세요
- 명확하고 설명적인 changeset 메시지를 작성하세요

### 커밋 메시지 형식

더 나은 구조화를 위해 다음 커밋 메시지 형식을 따르세요:

- `feat: 설명` - 새로운 기능
- `fix: 설명` - 버그 수정
- `docs: 설명` - 문서 변경
- `refactor: 설명` - 코드 리팩토링
- `test: 설명` - 테스트 추가 또는 수정
- `chore: 설명` - 유지보수 작업

풀 리퀘스트 제목도 이 형식을 따르세요.
