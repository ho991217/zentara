# 개발 가이드

## 배포 프로세스

패키지의 새 버전을 배포하려면 다음 명령어를 사용하세요:

```bash
pnpm release <패키지-디렉토리> <버전>
```

### 매개변수

- `패키지-디렉토리`: `packages/` 아래의 패키지 디렉토리 이름
  - `core`: `@zentara/core`
  - `plugins/suggestions`: `@zentara/plugin-suggestions`
  - 기타 등등
- `버전`: 다음 중 하나를 선택
  - `patch`: 버그 수정 (0.0.x)
  - `minor`: 새로운 기능 (0.x.0)
  - `major`: 호환성이 깨지는 변경 (x.0.0)
  - 특정 버전 번호 (예: "1.0.0")

### 예시

```bash
# core 패키지의 patch 버전 배포
pnpm release core patch

# suggestions 플러그인의 minor 버전 배포
pnpm release plugins/suggestions minor

# 특정 버전으로 배포
pnpm release core 1.0.0
```

### 배포 시 일어나는 일

1. 패키지의 `package.json`의 버전이 업데이트됨
2. 버전 변경에 대한 git 커밋이 생성됨
3. `@zentara/패키지-이름@버전` 형식의 git 태그가 생성됨
4. 변경사항이 GitHub에 푸시됨
5. GitHub Actions가 자동으로:
   - 패키지를 빌드
   - npm 레지스트리에 배포
   - GitHub Packages 레지스트리에 배포
   - GitHub Release를 생성:
     - 마지막 릴리스 이후의 변경사항 (feat:, fix:, docs:, refactor:로 시작하는 커밋)
     - 병합된 풀 리퀘스트 목록

### 사전 준비사항

1. `@zentara` organization에 대한 npm 접근 권한이 있어야 함
2. npm에 로그인되어 있어야 함 (`npm login`)
3. 태그와 패키지를 푸시할 수 있는 GitHub 권한이 있어야 함

### 패키지 설치

패키지는 npm과 GitHub Packages 레지스트리 모두에서 사용할 수 있습니다:

```bash
# npm 레지스트리에서 설치 (기본값)
npm install @zentara/core
pnpm add @zentara/core

# GitHub Packages 레지스트리에서 설치
npm install @zentara/core --registry=https://npm.pkg.github.com
pnpm add @zentara/core --registry=https://npm.pkg.github.com
```

### 주의사항

- 의존성 순서대로 배포하세요 (예: 플러그인보다 `core`를 먼저 배포)
- 배포하기 전에 항상 변경사항을 테스트하세요
- 시맨틱 버저닝 가이드라인을 따르세요:
  - MAJOR: 호환성이 깨지는 변경
  - MINOR: 새로운 기능 (하위 호환성 유지)
  - PATCH: 버그 수정 (하위 호환성 유지)

### 커밋 메시지 형식

더 나은 릴리스 노트를 위해 다음 커밋 메시지 형식을 따르세요:

- `feat: 설명` - 새로운 기능
- `fix: 설명` - 버그 수정
- `docs: 설명` - 문서 변경
- `refactor: 설명` - 코드 리팩토링
- `test: 설명` - 테스트 추가 또는 수정
- `chore: 설명` - 유지보수 작업

풀 리퀘스트 제목도 릴리스 노트에 포함되도록 이 형식을 따르세요.
