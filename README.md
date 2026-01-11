# Minutes (회의록 웹서비스 시스템)

Minutes는 현대 팀의 회의 협업을 위한 회의록 관리 플랫폼입니다. 혼란스러운 논의를 체계적인 인사이트로 변환하며,협업, 버전 관리 등의 기능으로 효율적인 회의록 관리를 제공합니다.

## 🚀 핵심 차별화 기능

### 1. 지능형 분석 (Intelligent Analysis)
- **스마트 정리**: 혼란스러운 논의 내용을 체계적으로 구조화
- **긴 회의 최적화**: 장시간 회의도 효율적으로 관리

### 2. 팀 협업 (Team Sync)
- **실시간 협업**: 팀과 함께 회의록을 작성하고 편집
- **액션 아이템 관리**: 회의에서 나온 결정사항과 할일을 명확히 추적
- **권한 관리**: Public/Team/Private 권한으로 세분화된 접근 제어

### 3. 데이터 시각화 (Visual Data)
- **버전 관리**: 모든 변경사항 자동 추적 및 히스토리 관리
- **버전 비교**: 서로 다른 버전 간의 차이점을 시각적으로 비교
- **회의 추세**: 회의 통계 및 분석을 한눈에 파악

### 4. 엔터프라이즈 보안 (Enterprise Security)
- **암호화**: 모든 데이터는 안전하게 암호화되어 저장
- **세분화된 권한 관리**: 팀 단위, 프로젝트 단위 접근 제어
- **감사 로그**: 모든 활동 기록으로 투명한 관리
- **소프트 삭제**: 삭제된 회의록은 휴지통에서 30일간 복구 가능

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

### ✅ 구현 완료 (85%)

**회의록 관리**
- 회의록 CRUD (생성, 조회, 수정, 삭제)
- Tiptap 기반 풀 에디터 (마크다운, 테이블, 체크리스트)
- 버전 관리 및 히스토리
- 액션 아이템 관리
- 템플릿 시스템
- 휴지통 (소프트 삭제)

**검색 및 필터링**
- 회의록 실시간 검색 (디바운싱 300ms)
- 회의록 필터링 (접근 수준별: 공개/팀/비공개)
- 회의록 정렬 (최신순, 오래된순, 제목순)
- 사용자 검색 (팀 멤버 추가 시)

**통계 및 분석**
- 회의 통계 API (`/meetings/stats/overview`)
- 분석 대시보드 페이지 (`/dashboard/analytics`)
- KPI 카드 (전체, 공개, 팀, 비공개)
- 접근 수준 분포 파이 차트
- 최근 7일 회의록 추세 막대 차트
- 상위 프로젝트 목록

**프로젝트 및 팀 관리**
- 프로젝트 CRUD (생성, 조회, 수정, 삭제)
- 프로젝트 검색 및 필터링
- 팀 CRUD (생성, 조회, 수정, 삭제)
- 팀 멤버 관리 (추가, 제거, 역할 관리)
- 팀 멤버 검색

**인증 및 권한**
- JWT 기반 인증 (회원가입, 로그인, 로그아웃)
- 권한 관리 (Public/Team/Private)
- SSR 하이드레이션 처리

**UI/UX**
- 랜딩 페이지 (R3F 3D 배경, 한글 UI)
- 대시보드 홈 (최근 회의록, 빠른 작업)
- 회의록 목록 (검색, 필터, 정렬)
- 프로젝트 관리 페이지
- 팀 관리 페이지
- 사용자 프로필 및 설정 페이지
- 사이드바 네비게이션 (분석 메뉴 포함)

**그 외**
- Recharts 차트 라이브러리 통합
- 다크모드 지원
- 반응형 디자인

### ⏳ 미구현 (15%)
- 실시간 협업 (WebSocket)
- 댓글/토론 기능
- @멘션 알림
- 고급 권한 설정 (커스텀 권한)
- 감사 로그
- Markdown/PDF 내보내기
- 모바일 앱
- 알림 시스템

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
│   │   │   │   ├── page.tsx            # 랜딩 페이지
│   │   │   │   ├── login/              # 로그인 페이지
│   │   │   │   ├── register/           # 회원가입 페이지
│   │   │   │   └── dashboard/          # 대시보드 페이지들
│   │   │   │       ├── page.tsx
│   │   │   │       ├── meetings/       # 회의록 관리
│   │   │   │       ├── projects/       # 프로젝트 관리
│   │   │   │       ├── teams/          # 팀 관리
│   │   │   │       ├── settings/       # 사용자 설정
│   │   │   │       ├── admin/          # 관리자 페이지
│   │   │   │       └── trash/          # 휴지통
│   │   │   ├── components/             # React 컴포넌트
│   │   │   │   ├── ui/                 # shadcn/ui 컴포넌트
│   │   │   │   ├── dashboard/          # 대시보드 컴포넌트
│   │   │   │   ├── editor/             # 에디터 컴포넌트
│   │   │   │   └── landing/            # 랜딩 페이지 컴포넌트
│   │   │   ├── lib/                    # 유틸리티 (API 클라이언트 등)
│   │   │   └── store/                  # Zustand 상태 관리
│   │   └── package.json
│   │
│   └── api/                    # NestJS 백엔드
│       ├── src/
│       │   ├── auth/           # 인증 모듈 (JWT)
│       │   ├── users/          # 사용자 모듈
│       │   ├── teams/          # 팀 모듈
│       │   ├── projects/       # 프로젝트 모듈
│       │   ├── meetings/       # 회의록 모듈 (핵심)
│       │   │   ├── meetings.controller.ts
│       │   │   ├── meetings.service.ts
│       │   │   └── meetings.module.ts
│       │   ├── entities/       # TypeORM 엔티티
│       │   ├── guards/         # 인증 가드
│       │   └── main.ts         # 애플리케이션 진입점
│       ├── .env.example        # 환경 변수 템플릿
│       ├── .env               # 환경 변수 (git 제외)
│       └── package.json
│
├── package.json                # 루트 패키지 (monorepo 설정)
├── .gitignore
├── README.md                   # 프로젝트 설명서
└── tsconfig.json              # TypeScript 설정

```

---

## 🔧 주요 API 엔드포인트

### 인증
- `POST /auth/signup` - 회원가입
- `POST /auth/login` - 로그인

### 회의록 (CRUD)
- `GET /meetings` - 회의록 목록 조회
- `GET /meetings/:id` - 회의록 상세 조회
- `POST /meetings` - 새 회의록 생성
- `PUT /meetings/:id` - 회의록 수정
- `DELETE /meetings/:id` - 회의록 삭제 (소프트 삭제)
- `DELETE /meetings/:id/permanent` - 회의록 영구 삭제
- `POST /meetings/:id/restore` - 휴지통에서 복구

### 회의록 검색 및 분석
- `GET /meetings/search?q=keyword` - 회의록 검색
- `GET /meetings/stats/overview` - **통계 조회** (전체/공개/팀/비공개, 상위 프로젝트, 일별 통계)
- `GET /meetings/trash` - 휴지통 목록
- `GET /meetings/:id/impact` - 삭제 영향도 분석

### 버전 관리
- `GET /meetings/:id/versions` - 버전 목록 조회
- `POST /meetings/:id/versions` - 새 버전 생성
- `POST /meetings/:id/versions/:versionId/restore` - 특정 버전으로 복구

### 프로젝트 관리
- `GET /projects` - 프로젝트 목록 조회
- `GET /projects/:id` - 프로젝트 상세 조회
- `POST /projects` - 프로젝트 생성
- `PUT /projects/:id` - 프로젝트 수정
- `DELETE /projects/:id` - 프로젝트 삭제
- `POST /projects/:id/restore` - 프로젝트 복구

### 팀 관리
- `GET /teams` - 팀 목록 조회
- `GET /teams/:id` - 팀 상세 조회
- `GET /teams/:id/members` - 팀 멤버 목록
- `POST /teams` - 팀 생성
- `PUT /teams/:id` - 팀 수정
- `DELETE /teams/:id` - 팀 삭제
- `POST /teams/:id/restore` - 팀 복구
- `POST /teams/:id/members` - 팀에 멤버 추가
- `DELETE /teams/:id/members/:userId` - 팀에서 멤버 제거
- `PUT /teams/:id/members/:userId` - 팀 멤버 역할 변경

### 사용자
- `GET /users/search?q=keyword` - 사용자 검색
- `PUT /users/me` - 프로필 수정 (이름, 이메일, 비밀번호)

---

## 📝 사용 예시

### 회의록 생성
1. 사이드바에서 "새 회의록" 버튼 클릭
2. 제목 입력
3. Tiptap 에디터에서 내용 작성
4. 자동 저장 또는 "저장" 버튼 클릭

### 회의록 검색 및 필터링
1. 회의록 목록 페이지 (`/dashboard/meetings`)
2. 상단 검색창에 키워드 입력 (자동 검색)
3. "필터" 버튼으로 접근 수준 필터 (공개/팀/비공개)
4. "정렬" 버튼으로 정렬 방식 선택 (최신순/오래된순/제목순)

### 통계 및 분석 보기
1. 사이드바의 "분석" 메뉴 클릭 (`/dashboard/analytics`)
2. 핵심 지표 (KPI) 카드 확인
3. 파이 차트에서 접근 수준 분포 확인
4. 막대 차트에서 최근 7일 추세 확인
5. 상위 프로젝트 목록 확인

### 프로젝트 관리
1. 사이드바에서 "프로젝트" 클릭
2. "프로젝트 생성" 버튼으로 새 프로젝트 생성
3. 프로젝트별 회의록 확인 및 관리

### 팀 관리
1. 사이드바에서 "팀" 클릭
2. "팀 생성" 버튼으로 새 팀 생성
3. 팀 멤버 추가/제거 및 역할 관리
4. 검색으로 팀 멤버 추가

### 버전 관리
1. 회의록 상세 페이지의 "버전 히스토리" 탭
2. 원하는 버전 선택 후 "복구" 버튼 클릭

---

## 🧪 테스트 및 E2E

현재 테스트 인프라 구축 중입니다.
```bash
# Playwright E2E 테스트 (추후 구현)
npm run test:e2e

# 백엔드 단위 테스트 (추후 구현)
npm run test:api
```

---

## 📄 라이선스

이 프로젝트는 ISC 라이선스를 따릅니다.
