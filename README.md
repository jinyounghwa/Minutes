# MeetingNotes (회의록 관리 시스템)

MeetingNotes는 Confluence와 Jira의 고질적인 문제인 "링크 지옥"과 "느린 속도"를 해결하기 위해 설계된 고성능 회의록 관리 시스템입니다. 선언형 프로그래밍과 반응형 최적화를 통해 직관적이고 빠른 사용자 경험을 제공합니다.

## 🚀 핵심 차별화 기능

### 1. 링크 지옥 해결 (Link Hell Resolved)
- **인라인 프리뷰**: 링크 위에 마우스를 올리면 페이지 이동 없이 해당 회의록의 내용을 즉시 미리 볼 수 있습니다.
- **사이드 패널 뷰**: 참조된 문서를 우측 패널에 열어 현재 회의록과 대조하며 작업할 수 있습니다.
- **브레드크럼 네비게이션**: 탐색 경로를 시각화하여 복잡한 문서 구조 속에서도 길을 잃지 않게 돕습니다.

### 2. 강력한 삭제 관리 및 영향도 분석
- **삭제 전 영향도 분석**: 문서를 삭제하기 전, 해당 문서를 참조하고 있는 다른 문서들을 추적하여 삭제로 인한 영향을 미리 경고합니다.
- **스마트 휴지통 (소프트 삭제)**: 삭제된 문서는 30일간 휴지통에 보관되며, 언제든지 복구가 가능합니다.

### 3. 버전 관리 및 복구 시스템
- **자동 스냅샷**: 작업 중인 내용을 자동으로 저장하고 버전을 생성합니다.
- **사이드-바이-사이드 비교**: 서로 다른 버전 간의 차이점(Diff)을 시각적으로 비교할 수 있습니다.
- **원클릭 복구**: 과거의 특정 시점으로 문서를 즉시 되돌릴 수 있습니다.

### 4. 고성능 웹 에디터
- **Tiptap V2 기반**: 마크다운 단축키, 테이블 편집, 체크리스트, 코드 블록 등을 지원하는 빠른 반응 속도의 에디터를 탑재했습니다.
- **실시간 저장**: 타이핑과 동시에 변경 사항을 안전하게 기록합니다.

---

## 🛠 기술 스택

### 프론트엔드 (apps/web)
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4 & shadcn/ui
- **State Management**: Zustand
- **Editor**: Tiptap V2 (Rich Text Editor)
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **UI Components**: Radix UI

### 백엔드 (apps/api)
- **Framework**: NestJS 11
- **ORM**: TypeORM
- **Database**: PostgreSQL 16
- **Auth**: Passport JWT (JWT Token-based)
- **Language**: TypeScript (ES2023)

---

## 📋 개발 상태

### ✅ 구현 완료 (60%)
- 회의록 CRUD (생성, 조회, 수정, 삭제)
- Tiptap 기반 풀 에디터
- 버전 관리 및 히스토리
- 문서 링크 추적 및 관리
- 삭제 영향도 분석
- 액션 아이템 관리
- 템플릿 시스템
- JWT 기반 인증
- 기본 권한 관리 (Public/Team/Private)
- 검색 기능
- 휴지통 (소프트 삭제)

### 🔄 진행 중 (30%)
- 프로젝트 관리 페이지 (UI 완성, API 부분 연동)
- 팀 관리 페이지 (UI 완성, API 부분 연동)
- 설정 페이지 (UI 완성, API 미연동)
- 관리자 패널 (UI 스텁)

### ⏳ 미구현 (10%)
- 실시간 협업 (WebSocket)
- 댓글/토론 기능
- @멘션 알림
- 고급 권한 설정 (커스텀 권한)
- 감사 로그
- Markdown/PDF 내보내기

---

## 🏃 시작하기

### 사전 준비 사항
- Node.js (v20 이상)
- PostgreSQL 16 이상

### 설치 및 실행

1. **저장소 클론**
   ```bash
   git clone https://github.com/jinyounghwa/Minutes.git
   cd Minutes
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **환경 변수 설정**

   `apps/api/.env` 파일을 생성하고 `apps/api/.env.example`을 참고하여 설정합니다:
   ```bash
   cp apps/api/.env.example apps/api/.env
   # 필요한 값들을 입력합니다
   ```

4. **데이터베이스 초기화**
   ```bash
   # PostgreSQL에서 데이터베이스 생성
   createdb minutes
   ```

5. **애플리케이션 실행**

   **터미널 1 - 백엔드 시작 (포트 4000)**
   ```bash
   npm run dev:api
   ```

   **터미널 2 - 프론트엔드 시작 (포트 3000)**
   ```bash
   npm run dev:web
   ```

6. **접속**
   - 프론트엔드: http://localhost:3000
   - 백엔드 API: http://localhost:4000

---

## 📁 프로젝트 구조

```text
.
├── apps/
│   ├── web/                    # Next.js 16 프론트엔드
│   │   ├── src/
│   │   │   ├── app/            # 페이지 및 레이아웃
│   │   │   │   └── dashboard/  # 대시보드 페이지들
│   │   │   ├── components/     # React 컴포넌트
│   │   │   │   ├── ui/         # shadcn/ui 컴포넌트
│   │   │   │   └── dashboard/  # 대시보드 컴포넌트
│   │   │   ├── lib/            # 유틸리티 (API 클라이언트 등)
│   │   │   └── store/          # Zustand 상태 관리
│   │   └── package.json
│   │
│   └── api/                    # NestJS 백엔드
│       ├── src/
│       │   ├── auth/           # 인증 모듈
│       │   ├── users/          # 사용자 모듈
│       │   ├── teams/          # 팀 모듈
│       │   ├── projects/       # 프로젝트 모듈
│       │   ├── meetings/       # 회의록 모듈 (핵심)
│       │   ├── entities/       # TypeORM 엔티티
│       │   └── main.ts         # 애플리케이션 진입점
│       ├── .env.example        # 환경 변수 템플릿
│       ├── .env               # 환경 변수 (git 제외)
│       └── package.json
│
├── package.json                # 루트 패키지 (monorepo 설정)
├── .gitignore
├── claude123.md               # 프로젝트 전체 명세서
└── README.md

```

---

## 🔧 주요 API 엔드포인트

### 인증
- `POST /auth/signup` - 회원가입
- `POST /auth/login` - 로그인

### 회의록
- `GET /meetings` - 회의록 목록 조회
- `POST /meetings` - 새 회의록 생성
- `GET /meetings/:id` - 회의록 상세 조회
- `PUT /meetings/:id` - 회의록 수정
- `DELETE /meetings/:id` - 회의록 삭제 (휴지통)
- `POST /meetings/:id/restore` - 휴지통에서 복구

### 버전 관리
- `GET /meetings/:id/versions` - 버전 목록 조회
- `POST /meetings/:id/versions` - 새 버전 생성
- `POST /meetings/:id/versions/:versionId/restore` - 특정 버전으로 복구

### 검색 및 기타
- `GET /meetings/search?q=keyword` - 검색
- `GET /meetings/trash` - 휴지통 목록
- `GET /meetings/:id/impact` - 삭제 영향도 분석

---

## 📝 사용 예시

### 회의록 생성
1. 대시보드에서 "새 회의록" 또는 "오늘 회의록 생성" 클릭
2. 제목 입력
3. Tiptap 에디터에서 내용 작성
4. 자동 저장 또는 "저장" 버튼 클릭

### 회의록 검색
1. 회의록 목록 페이지의 검색창 사용
2. 프로젝트, 작성자, 날짜 등으로 필터링

### 버전 관리
1. 회의록 상세 페이지의 "버전 히스토리" 탭
2. 원하는 버전 선택 후 "복구" 버튼 클릭

---

## 🧪 테스트

현재 테스트 인프라가 설정되어 있으나, 테스트 케이스는 작성되지 않았습니다.
```bash
# 향후 테스트 실행 예정
npm run test:api
```

---

## 📄 라이선스

이 프로젝트는 ISC 라이선스를 따릅니다.
