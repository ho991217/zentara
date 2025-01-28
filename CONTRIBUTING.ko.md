# Contributing to Zentara

[English](CONTRIBUTING.md) | [한국어](CONTRIBUTING.ko.md)

Zentara에 기여하는 것을 고려해주셔서 감사합니다! 이 문서는 기여 프로세스에 대한 가이드라인을 제공합니다.

## 개발 환경 설정

1. 저장소를 포크하고 클론합니다:

```bash
git clone https://github.com/[your-username]/zentara.git
cd zentara
```

2. pnpm을 설치합니다 (아직 설치하지 않은 경우):

```bash
npm install -g pnpm
```

3. 의존성을 설치합니다:

```bash
pnpm install
```

4. 개발 서버를 실행합니다:

```bash
pnpm dev
```

## 브랜치 전략

- `main`: 안정적인 릴리즈 버전
- `develop`: 개발 중인 기능들이 통합되는 브랜치
- `feature/*`: 새로운 기능 개발
- `fix/*`: 버그 수정
- `docs/*`: 문서 수정

## Pull Request 프로세스

1. 새로운 브랜치를 생성합니다:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-fix-name
```

2. 변경사항을 커밋합니다:

```bash
git add .
git commit -m "feat: add new feature"
# or
git commit -m "fix: resolve issue"
```

3. 원격 저장소에 푸시합니다:

```bash
git push origin feature/your-feature-name
```

4. GitHub에서 Pull Request를 생성합니다.

## 커밋 메시지 컨벤션

- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 포맷팅, 세미콜론 누락 등
- `refactor`: 코드 리팩토링
- `test`: 테스트 코드
- `chore`: 빌드 프로세스 또는 보조 도구 변경

예시:

```
feat: add emoji search functionality
fix: resolve keyboard navigation issue
docs: update plugin usage examples
```

## 코드 스타일

- [Biome](https://biomejs.dev/)를 사용하여 코드 스타일을 유지합니다.
- PR을 제출하기 전에 다음 명령어를 실행해주세요:

```bash
pnpm lint
pnpm format
```

## 테스트

- 새로운 기능을 추가하거나 버그를 수정할 때는 관련 테스트를 함께 작성해주세요.
- PR을 제출하기 전에 모든 테스트가 통과하는지 확인해주세요.

## 문서화

- 새로운 기능을 추가할 때는 관련 문서도 함께 업데이트해주세요.
- 코드 내 주석은 명확하고 필요한 경우에만 작성해주세요.
- TypeScript 타입 정의를 최신 상태로 유지해주세요.

## 라이선스

이 프로젝트에 기여함으로써, 귀하의 기여물이 MIT 라이선스 하에 배포되는 것에 동의하게 됩니다.

## 질문이나 문제가 있나요?

- Issue를 생성하여 질문하거나 문제를 보고해주세요.
- Discussion을 통해 아이디어를 제안하거나 논의할 수 있습니다.

다시 한 번 기여해주셔서 감사합니다! 🙏
