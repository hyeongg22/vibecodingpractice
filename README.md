# 오늘의 명언 생성기

위인과 철학자의 명언을 검색하고, 마음에 드는 문장을 목록에 저장할 수 있는 웹앱입니다.

로컬에서는 GPT API로 한국어, 영어, 일본어, 중국어, 스페인어 명언도 만들 수 있습니다.

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:5173 으로 접속합니다.

AI 명언을 쓰려면 프로젝트 폴더의 `.env` 파일에 OpenAI API 키를 넣습니다.

```
OPENAI_API_KEY=여기에_키를_붙여넣기
```

## GitHub Pages 배포본 만들기

```bash
npm run build:pages
```

만들어진 파일은 `dist` 폴더에 있으며, GitHub Pages용으로 `docs` 폴더에 복사해 배포합니다.

## 배포 주소

https://hyeongg22.github.io/vibecodingpractice/
