# 우리 — 커플 D-Day 앱

사랑하는 사람과의 디데이를 한 곳에서.  
오늘이 며칠째인지, 그날까지 며칠인지.

**🔗 [https://web-pi-peach-0p8bg3cm0g.vercel.app](https://web-pi-peach-0p8bg3cm0g.vercel.app)**

<br/>

## 소개

**우리**는 커플을 위한 D-Day 기록 앱이에요.  
함께한 날을 세는 카운트업과 기념일까지 남은 카운트다운을 한 앱에서 관리할 수 있어요.  
PWA로 제작되어 스마트폰 홈 화면에 설치해 앱처럼 사용할 수 있어요.

<br/>

## 주요 기능

### 📌 다가오는 날
- 기념일, 생일, 여행 등 특별한 날까지 D-Day 카운트다운
- 100일, 200일, 1주년 등 자동 기념일 생성
- 이모지와 색상으로 나만의 스타일 커스터마이징

### 🕐 지난 기록
- 지나간 기념일 자동 누적
- 함께 보낸 소중한 날들을 한눈에

### 📷 함께한 순간
- 디데이마다 사진 기록
- 우리만의 추억 갤러리

### 커플 프로필
- 이름, 사귄 날짜, 생일 설정
- D+일수 카운터 실시간 표시

<br/>

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | React 19 + TypeScript |
| 번들러 | Vite 8 |
| 스타일 | Tailwind CSS v4 |
| PWA | vite-plugin-pwa |
| 데이터 저장 | localStorage (서버 없음) |

<br/>

## 로컬 실행

```bash
# 패키지 설치
npm install

# 개발 서버 시작
npm run dev

# 프로덕션 빌드
npm run build
```

<br/>

## 배포

**🔗 [https://web-pi-peach-0p8bg3cm0g.vercel.app](https://web-pi-peach-0p8bg3cm0g.vercel.app)**

Vercel로 배포되어 있어요. 정적 파일만 사용하므로 별도 서버 없이 어디서든 배포 가능해요.

```bash
npm run build
# dist/ 폴더를 Vercel, Netlify, GitHub Pages 등에 업로드
```

<br/>

## 데이터 저장 방식

모든 데이터는 기기의 **localStorage**에 저장돼요.  
서버나 계정이 필요 없고 완전히 오프라인에서 동작해요.  
단, 브라우저 데이터를 삭제하면 기록도 함께 삭제되니 주의하세요.

<br/>

## 디자인

- 메인 컬러: 코랄 `#EE898C` + 모브 `#9D8BD0`
- 소프트 파스텔 무드의 커플 감성 UI
- 모바일 우선 반응형 레이아웃
