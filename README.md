# web-client

## 실행 방법

```bash
npm install
npm run dev
```

개발 서버 기본 주소는 `http://localhost:5173`입니다.

## 빌드

```bash
npm run build
```

## 환경변수

로컬 실행 설정은 `.env`에서 관리합니다. 브라우저에 노출되는 값은 `VITE_` 접두사를 사용합니다.

가맹점 웹과 백엔드를 함께 실행할 때는 `.env.example`을 기준으로 `.env`를 작성합니다.

```env
VITE_APP_SERVICE=web-merchant
VITE_AUTH_PROXY_TARGET=http://localhost:8091
VITE_MERCHANT_PROXY_TARGET=http://localhost:8094
VITE_KAKAO_CLIENT_ID=카카오_REST_API_KEY
VITE_KAKAO_REDIRECT_URI=http://localhost:5173/
```

카카오 Developers에도 Redirect URI로 `http://localhost:5173/`를 등록하고,
`pg-auth-service`의 `KAKAO_REDIRECT_URI`도 같은 값으로 설정해야 합니다.

현재 연동 범위:

- `pg-auth-service`: 카카오 로그인, 약관 동의, 가맹점 가입, 로그아웃
- `merchant-service`: 로그인 가맹점 기본정보 조회
- 매출, 거래, 정산: 대응 백엔드 API가 준비될 때까지 목 데이터 사용
