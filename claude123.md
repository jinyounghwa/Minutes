# 회의록 웹서비스 기능 명세서

> **프로젝트명**: MeetingNotes (가칭)  
> **기술 스택**: Next.js 16 + NestJS + TypeORM + PostgreSQL  
> **개발 목표**: Confluence/Jira의 불편함을 해소한 직관적이고 빠른 회의록 관리 시스템
> **개발 방법**: 선언형 프로그래밍으로 반드시 개발함, 반응형 최적화 반드시 진행, 
> **소개 페이지 UI**: https://generativeui.github.io/  페이지를 참고하여 소개 페이지 UI를 구현함
> **에디터 개발** : 반드시 웹 에디터를 제대로 구현해야 하며 기능에 문제가 없을 것 
---

## 목차
1. [프로젝트 개요](#1-프로젝트-개요)
2. [핵심 차별화 기능](#2-핵심-차별화-기능)
3. [기술 스택](#3-기술-스택)
4. [데이터베이스 스키마](#4-데이터베이스-스키마)
5. [API 엔드포인트](#5-api-엔드포인트)
6. [주요 화면 구성](#6-주요-화면-구성)
7. [개발 우선순위](#7-개발-우선순위)
8. [추후 개발 사항](#8-추후-개발-사항)

---

## 1. 프로젝트 개요

### 1.1 배경 및 목적
Confluence와 Jira의 주요 불편 사항:
- **링크 지옥**: 회의록 간 이동 시 탭이 계속 쌓이고 길을 잃음
- **느린 속도**: 페이지 로딩, 에디터 반응 속도 느림
- **복잡한 UI**: 불필요한 기능이 너무 많음
- **검색 불편**: 원하는 회의록 찾기 어려움
- **권한 관리 복잡**: 누가 볼 수 있는지 불명확

→ **이를 해결하는 빠르고 직관적인 회의록 시스템 개발**

### 1.2 핵심 가치
- **속도**: 빠른 로딩, 즉각적인 에디터 반응
- **단순함**: 필요한 기능만, 직관적인 UI
- **투명성**: 권한과 링크 상태를 명확히 표시
- **안전성**: 삭제 전 영향도 분석, 버전 관리

---

## 2. 핵심 차별화 기능

### 2.1 링크 지옥 해결

#### 2.1.1 인라인 프리뷰
- 링크에 마우스 오버 시 팝업으로 회의록 미리보기
- 새 탭/페이지 이동 없이 내용 확인 가능
- 미리보기에서 바로 이동 버튼 제공

```
┌────────────────────────────────┐
│ [Q4 전략 회의] ← hover         │
│  ┌──────────────────────┐      │
│  │ Q4 전략 회의          │      │
│  │ 2025-01-08           │      │
│  │ 참석자: 진영화, 홍길동 │      │
│  │ 주요 안건:           │      │
│  │ - 신규 서비스 론칭... │      │
│  │ [회의록 열기 →]      │      │
│  └──────────────────────┘      │
└────────────────────────────────┘
```

#### 2.1.2 사이드 패널 뷰
- 링크 클릭 시 현재 페이지는 유지
- 오른쪽에 패널 형태로 링크된 회의록 표시
- 여러 개 열람 가능, 쉬운 비교

```
┌─────────────────┬──────────────┐
│ 현재 회의록       │ 참조 회의록    │
│                 │ ┌──────────┐ │
│ 내용...         │ │ Q4 전략   │ │
│ [링크] 클릭 →   │ │          │ │
│                 │ │ 내용...   │ │
│                 │ │          │ │
│                 │ └──────────┘ │
└─────────────────┴──────────────┘
```

#### 2.1.3 브레드크럼 네비게이션
- 탐색 경로 시각화
- 클릭으로 빠른 이동

```
홈 > 프로젝트A > Q4 회의록 > 상세 계획 > 현재 위치
     ↑ 클릭 시 즉시 이동
```

#### 2.1.4 링크 상태 표시
회의록 링크 옆에 아이콘으로 상태 표시:

| 아이콘 | 의미 | 설명 |
|--------|------|------|
| 🔓 | Public | 누구나 접근 가능 |
| 🔒 | Team | 팀 멤버만 접근 가능 |
| 🔐 | Private | 참석자만 접근 가능 |
| ⚠️ | 삭제 예정 | 휴지통에 있음 (30일 후 삭제) |
| 🗑️ | 삭제됨 | 영구 삭제된 링크 |

**예시**:
```
- [Q4 전략 회의] 🔓 전체 공개
- [1:1 미팅 노트] 🔐 비공개
- [지난 회의록] ⚠️ 삭제 예정
- [옛날 회의록] 🗑️ 삭제됨
```

---

### 2.2 삭제 관리 시스템

#### 2.2.1 삭제 전 영향도 분석
삭제 버튼 클릭 시 모달 표시:

```
┌─────────────────────────────────────┐
│ ⚠️ 회의록 삭제 확인                  │
├─────────────────────────────────────┤
│ 이 회의록을 참조하는 문서:           │
│                                     │
│ 1. [프로젝트 킥오프 회의]            │
│ 2. [주간 스프린트 회고]              │
│ 3. [Q4 로드맵 논의]                 │
│                                     │
│ 총 3개의 회의록이 영향을 받습니다.   │
│                                     │
│ [취소]  [휴지통으로 이동]            │
└─────────────────────────────────────┘
```

#### 2.2.2 소프트 삭제 (휴지통)
- 즉시 삭제 대신 30일간 휴지통 보관
- 휴지통에서 언제든 복구 가능
- 30일 후 자동 영구 삭제

```
휴지통
┌────────────────────────────────────┐
│ 제목            │ 삭제일  │ 남은기간 │
├────────────────────────────────────┤
│ Q3 회의록       │ 1/5    │ 25일     │
│ [복구] [영구삭제]                  │
└────────────────────────────────────┘
```

#### 2.2.3 자동 정리 시스템
**매일 자정 실행되는 배치 작업**:

1. **30일 지난 휴지통 항목 영구 삭제**
2. **깨진 링크 자동 감지 및 업데이트**
   - 삭제된 회의록 참조하는 링크 찾기
   - `~~취소선~~` + 🗑️ 뱃지 자동 추가
3. **관련자 알림 발송**
   - "참조하던 '프로젝트 A 회의록'이 삭제되었습니다"
4. **검색 인덱스 최적화**

**자동 정리 결과 예시**:
```markdown
원본: [프로젝트 A 계획]
변환: ~~[프로젝트 A 계획]~~ 🗑️ 삭제됨
```

---

### 2.3 버전 관리

#### 2.3.1 자동 스냅샷
- **타이핑 멈춘 후 5분마다 자동 저장**
- **중요 변경 시 즉시 버전 생성** (예: 제목 변경, 대량 삭제)
- 각 버전에 타임스탬프와 작성자 기록

#### 2.3.2 버전 비교 뷰
```
┌─────────────────────────────────────┐
│ 버전 비교                            │
├─────────────┬───────────────────────┤
│ v5 (현재)    │ v3 (2일 전)           │
├─────────────┼───────────────────────┤
│ ## 안건      │ ## 안건               │
│ 1. 신규 기능 │ 1. ~~기존 기능~~      │
│ 2. 일정 조정 │ 2. 일정 논의          │
│              │                       │
│ + 추가됨 (녹색)                      │
│ - 삭제됨 (빨강)                      │
│ ~ 수정됨 (노랑)                      │
└─────────────┴───────────────────────┘
```

#### 2.3.3 타임라인 뷰
```
v1 ──────> v2 ──────> v3 ──────> v4 ──────> v5 (현재)
1/8 14:00  1/8 15:30  1/9 09:00  1/10 11:00  1/11 10:00
진영화     홍길동     진영화     김철수      진영화
                              ↑
                         [이 버전으로 복구]
```

#### 2.3.4 원클릭 복구
- 특정 버전 선택 → "이 버전으로 복구" 버튼 클릭
- 전체 복구 또는 부분 복구 (특정 섹션만) 선택 가능

---

### 2.4 강력한 검색 기능

#### 2.4.1 통합 검색
```
┌─────────────────────────────────────┐
│ 🔍 검색: [프로젝트 A 회의___________]│
│                                     │
│ 필터:                               │
│ 프로젝트: [전체 ▼]                  │
│ 작성자:   [전체 ▼]                  │
│ 날짜:     [이번 주 ▼]               │
│ 태그:     [#기획 #개발]             │
│                                     │
│ [검색]                              │
└─────────────────────────────────────┘
```

**검색 대상**:
- 제목
- 본문 내용
- 참석자 이름
- 태그
- 액션 아이템

#### 2.4.2 검색 결과 미리보기
```
검색 결과: 5건

┌─────────────────────────────────────┐
│ 프로젝트 A 킥오프 회의               │
│ 2025-01-08 | 진영화, 홍길동          │
│                                     │
│ ...우리는 **프로젝트 A**의 목표를... │
│ ...다음 회의에서 **프로젝트 A**...   │
│                                     │
│ 🔓 전체 공개 | #기획 #킥오프          │
└─────────────────────────────────────┘
     ↑ 검색어 하이라이트
```

#### 2.4.3 고급 필터링
- **날짜 범위**: 오늘, 어제, 이번 주, 이번 달, 지난 달, 커스텀
- **프로젝트별**: 드롭다운 선택
- **작성자별**: 다중 선택 가능
- **태그 조합**: AND/OR 검색
- **참석자 포함**: 특정 인물이 참석한 회의만

---

### 2.5 접근 권한 관리

#### 2.5.1 권한 레벨
```
Public   🔓  누구나 읽기 가능
Team     🔒  특정 팀만 접근 가능
Private  🔐  참석자만 접근 가능
Custom   🎛️  개별 사용자 지정
```

#### 2.5.2 권한 설정 UI
```
┌─────────────────────────────────────┐
│ 회의록 권한 설정                     │
├─────────────────────────────────────┤
│ 기본 권한: [Team ▼]                 │
│                                     │
│ 팀 선택: [개발팀 ▼]                 │
│                                     │
│ 개별 권한 추가:                     │
│ + 홍길동 (읽기)                     │
│ + 김철수 (쓰기)                     │
│ + 이영희 (관리자)                   │
│                                     │
│ [저장]                              │
└─────────────────────────────────────┘
```

#### 2.5.3 접근 시도 로그
권한 없이 접근 시도한 사람 기록:
```
접근 거부 로그
- 홍길동 (2025-01-11 10:30) → 권한 부여 요청
- 김철수 (2025-01-10 15:20) → 거부됨
```

---

### 2.6 고성능 웹 에디터

#### 2.6.1 에디터 선택
**Tiptap v2** 또는 **Lexical** (추천)
- React 기반
- 빠른 렌더링
- 마크다운 지원
- 확장 가능

#### 2.6.2 핵심 기능

**마크다운 단축키**:
```
# + Space     → 제목 1
## + Space    → 제목 2
- + Space     → 리스트
[ ] + Space   → 체크박스
``` + Space   → 코드 블록
```

**실시간 자동 저장**:
- 타이핑 멈춘 후 2초마다 자동 저장
- 저장 상태 표시: "저장 중...", "모든 변경사항 저장됨 ✓"

**드래그 앤 드롭**:
- 이미지 끌어다 놓으면 자동 업로드
- 파일 첨부 지원

**기타 기능**:
- 코드 블록 신택스 하이라이팅
- 테이블 편집
- 체크리스트
- @mention (참석자 태그)

#### 2.6.3 협업 기능 (선택)
- **실시간 멀티 커서**: 여러 명이 동시 편집 시 커서 표시
- **인라인 댓글**: 특정 텍스트에 댓글 달기

---

### 2.7 템플릿 시스템

#### 2.7.1 기본 템플릿 (2025년 8월 스타일)
```markdown
# [프로젝트명] 회의록

**일시**: 2025-01-11 14:00
**장소**: 
**참석자**: @진영화, 
**작성자**: @진영화

## 안건
1. 

## 논의 내용

## 결정 사항
- [ ] 

## 액션 아이템
- [ ] [@담당자] 업무 내용 (마감: YYYY-MM-DD)

## 다음 회의
- 일시: 
- 안건: 
```

#### 2.7.2 빠른 생성 버튼
```
┌─────────────────────────────────────┐
│ [⚡ 오늘 회의록 생성]                │
│                                     │
│ 클릭 시:                            │
│ - 현재 날짜/시간 자동 입력          │
│ - 기본 템플릿 적용                  │
│ - 즉시 편집 모드                    │
└─────────────────────────────────────┘
```

#### 2.7.3 커스텀 템플릿
- 자주 쓰는 형식을 템플릿으로 저장
- 팀별 템플릿 공유 가능
- 템플릿 라이브러리

```
내 템플릿
- 주간 회고 템플릿
- 1:1 미팅 템플릿
- 기획 회의 템플릿
[+ 새 템플릿 만들기]
```

---

### 2.8 통합 관리자 기능

#### 2.8.1 관리자 대시보드
```
┌─────────────────────────────────────┐
│ Admin Dashboard                     │
├─────────────────────────────────────┤
│                                     │
│ 📊 통계                             │
│ - 전체 회원: 127명                  │
│ - 활성 회원: 98명 (7일 내 로그인)   │
│ - 전체 회의록: 1,432개              │
│ - 이번 주 생성: 45개                │
│                                     │
│ 📈 활동 추이 (그래프)               │
│                                     │
│ ⚠️ 주의 필요                        │
│ - 30일 후 삭제 예정: 5개            │
│ - 권한 요청 대기: 3건               │
└─────────────────────────────────────┘
```

#### 2.8.2 회원 관리
```
┌─────────────────────────────────────────────────────┐
│ 회원 관리                    [+ 회원 추가] [CSV 업로드]│
├─────────────────────────────────────────────────────┤
│ 🔍 [검색_____] 역할:[전체▼] 상태:[전체▼]             │
├────┬──────┬────────┬──────┬─────┬─────┬──────────┤
│ ☑  │ 이름  │ 이메일   │ 역할  │ 팀   │ 상태 │ 작업      │
├────┼──────┼────────┼──────┼─────┼─────┼──────────┤
│ ☑  │ 진영화 │ jin@... │ Admin│ Dev │ 🟢  │ [편집]    │
│ ☑  │ 홍길동 │ hong@..│ Member│ PM │ 🟢  │ [편집]    │
│ ☑  │ 김철수 │ kim@...│ Viewer│ QA │ 🟢  │ [편집]    │
└────┴──────┴────────┴──────┴─────┴─────┴──────────┘
 [선택 항목 역할 변경 ▼]  [선택 항목 비활성화]
```

**회원 상세 정보**:
- 기본 정보 (이름, 이메일, 프로필)
- 활동 통계 (작성한 회의록, 참여한 회의록)
- 최근 활동 로그
- 소속 팀/프로젝트

#### 2.8.3 역할 및 권한 관리

**시스템 역할**:
```
Super Admin   - 모든 권한 (시스템 설정, 모든 데이터 접근)
Admin         - 회원/팀 관리, 전체 회의록 관리
Team Leader   - 팀 내 회원/회의록 관리
Member        - 일반 사용자 (자신의 회의록 관리)
Viewer        - 읽기 전용
```

**권한 매트릭스**:
```
┌─────────────────────────────────────────────────────┐
│ 역할별 권한 설정                                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│ 기능              │Super│Admin│Leader│Member│Viewer│
│─────────────────│─────│─────│──────│──────│──────│
│ 회원 추가/삭제    │  ✅  │  ✅  │  ❌   │  ❌   │  ❌   │
│ 역할 변경        │  ✅  │  ✅  │  🟡   │  ❌   │  ❌   │
│ 전체 회의록 조회  │  ✅  │  ✅  │  🟡   │  🟡   │  🟡   │
│ 회의록 생성      │  ✅  │  ✅  │  ✅   │  ✅   │  ❌   │
│ 회의록 수정      │  ✅  │  ✅  │  🟡   │  🟡   │  ❌   │
│ 회의록 삭제      │  ✅  │  ✅  │  🟡   │  🟡   │  ❌   │
│ 시스템 설정      │  ✅  │  ❌  │  ❌   │  ❌   │  ❌   │
│                                                     │
│ 🟡 = 제한적 권한 (본인 것만 or 팀 내만)              │
│                                                     │
│           [변경사항 저장]  [초기화]                   │
└─────────────────────────────────────────────────────┘
```

#### 2.8.4 팀 관리
```
팀 목록
┌─────────────────────────────────────┐
│ 개발팀       리더: 진영화   15명     │
│ 기획팀       리더: 홍길동   8명      │
│ 디자인팀     리더: 김철수   5명      │
│ [+ 새 팀 추가]                      │
└─────────────────────────────────────┘

팀 상세 (개발팀)
┌─────────────────────────────────────┐
│ 팀명: 개발팀                        │
│ 설명: 프론트엔드 및 백엔드 개발     │
│ 리더: 진영화                        │
│                                     │
│ 팀원 (15명):                        │
│ - 홍길동 (Member)                   │
│ - 김철수 (Member)                   │
│ - 이영희 (Member)                   │
│ [+ 팀원 추가]                       │
│                                     │
│ [편집] [삭제]                       │
└─────────────────────────────────────┘
```

#### 2.8.5 회의록 관리
```
전체 회의록 목록
┌─────────────────────────────────────────────────────┐
│ 필터: [프로젝트▼] [팀▼] [상태▼] [날짜▼]              │
├────┬────────────┬──────┬──────┬─────┬──────────┤
│ ID │ 제목        │ 작성자│ 프로젝트│ 날짜│ 작업     │
├────┼────────────┼──────┼──────┼─────┼──────────┤
│ 1  │ Q4 전략회의 │ 진영화│ 전사  │1/11 │ [보기]   │
│ 2  │ 주간 회고   │ 홍길동│ 개발  │1/10 │ [보기]   │
└────┴────────────┴──────┴──────┴─────┴──────────┘
```

**회의록 통계**:
- 일별/주별/월별 생성 통계 (차트)
- 팀별/프로젝트별 활동 현황
- 가장 많이 참조된 회의록 Top 10
- 미사용 회의록 탐지 (90일 이상 조회 없음)

#### 2.8.6 휴지통 관리
```
┌─────────────────────────────────────────────────────┐
│ 휴지통 (전체)                                        │
├────┬────────────┬──────┬──────┬─────┬──────────┤
│ 제목│ 삭제자      │ 삭제일│ 남은일│ 작업       │
├────┼────────────┼──────┼──────┼─────┼──────────┤
│ Q3 │ 진영화      │ 1/5  │ 25일 │ [복구][영구] │
│ 옛날│ 홍길동      │12/15 │ 3일  │ [복구][영구] │
└────┴────────────┴──────┴──────┴─────┴──────────┘

⚠️ 3일 내 영구 삭제 예정: 1건
```

---

### 2.9 마크다운 내보내기

#### 2.9.1 내보내기 버튼
```
회의록 상세 페이지
┌─────────────────────────────────────┐
│ [편집] [공유] [삭제] [내보내기 ▼]   │
│                      ├─ Markdown   │
│                      ├─ PDF        │
│                      └─ Word       │
└─────────────────────────────────────┘
```

#### 2.9.2 내보내기 형식
**Markdown (.md)**:
```markdown
# Q4 전략 회의

**작성일**: 2025-01-11 14:00
**작성자**: 진영화
**참석자**: 진영화, 홍길동, 김철수
**프로젝트**: 신규 서비스 개발
**태그**: #기획, #전략, #Q4

---

## 안건
1. 신규 서비스 론칭 일정
2. 팀 구성 및 역할 분담

## 논의 내용
...

## 결정 사항
- [ ] 2월 15일 베타 론칭 확정

## 액션 아이템
- [ ] @홍길동 기획서 작성 (마감: 2025-01-20)
- [ ] @김철수 디자인 시안 (마감: 2025-01-25)

---

*이 문서는 2025-01-11 16:30:00에 내보내졌습니다.*
```

**PDF 내보내기**:
- 깔끔한 포맷팅
- 목차 자동 생성
- 페이지 번호

**Word 내보내기** (선택):
- .docx 형식
- 스타일 유지

---

## 3. 기술 스택

### 3.1 Frontend
```yaml
Framework: Next.js 16 (App Router)
Language: TypeScript
UI Library: React 19
Styling: Tailwind CSS
Component: shadcn/ui
Editor: Tiptap v2
State: Zustand
Table: TanStack Table (관리자)
Form: React Hook Form
Validation: Zod
```

### 3.2 Backend
```yaml
Framework: NestJS
Language: TypeScript
ORM: TypeORM
Database: PostgreSQL 16
Auth: JWT (Access + Refresh Token)
WebSocket: Socket.io (실시간 협업)
File Storage: AWS S3 또는 Local Storage
Cron: @nestjs/schedule
```

### 3.3 Infrastructure
```yaml
Container: Docker
Reverse Proxy: Nginx
CI/CD: GitHub Actions
Monitoring: (추후)
```

---

## 4. 데이터베이스 스키마

### 4.1 핵심 테이블

#### User (사용자)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'member',
    -- 'super_admin', 'admin', 'team_leader', 'member', 'viewer'
  status VARCHAR(20) NOT NULL DEFAULT 'active',
    -- 'active', 'inactive', 'locked'
  profile_image VARCHAR(500),
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_deleted_at ON users(deleted_at);
```

#### Team (팀)
```sql
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  leader_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);
```

#### TeamMember (팀 멤버)
```sql
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL DEFAULT 'member',
    -- 'leader', 'member'
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);
```

#### Project (프로젝트)
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  team_id UUID REFERENCES teams(id),
  owner_id UUID REFERENCES users(id),
  default_access_level VARCHAR(20) DEFAULT 'team',
    -- 'public', 'team', 'private'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);
```

#### Meeting (회의록)
```sql
CREATE TABLE meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  content JSONB NOT NULL,
    -- Tiptap JSON 형식
  content_text TEXT,
    -- 검색용 플레인 텍스트
  template_id UUID REFERENCES templates(id),
  project_id UUID REFERENCES projects(id),
  created_by UUID REFERENCES users(id),
  access_level VARCHAR(20) NOT NULL DEFAULT 'team',
    -- 'public', 'team', 'private', 'custom'
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- 전문 검색 인덱스
CREATE INDEX idx_meetings_content_text ON meetings 
  USING GIN (to_tsvector('korean', content_text));
CREATE INDEX idx_meetings_tags ON meetings USING GIN (tags);
CREATE INDEX idx_meetings_deleted_at ON meetings(deleted_at);
```

#### MeetingPermission (회의록 권한)
```sql
CREATE TABLE meeting_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  team_id UUID REFERENCES teams(id),
  permission VARCHAR(20) NOT NULL,
    -- 'read', 'write', 'admin'
  created_at TIMESTAMP DEFAULT NOW(),
  CHECK (user_id IS NOT NULL OR team_id IS NOT NULL)
);
```

#### MeetingVersion (버전 히스토리)
```sql
CREATE TABLE meeting_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  content JSONB NOT NULL,
  version INTEGER NOT NULL,
  created_by UUID REFERENCES users(id),
  change_description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_meeting_versions_meeting_id ON meeting_versions(meeting_id);
```

#### MeetingLink (링크 참조)
```sql
CREATE TABLE meeting_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  target_meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(source_meeting_id, target_meeting_id)
);

CREATE INDEX idx_meeting_links_source ON meeting_links(source_meeting_id);
CREATE INDEX idx_meeting_links_target ON meeting_links(target_meeting_id);
```

#### MeetingParticipant (참석자)
```sql
CREATE TABLE meeting_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) DEFAULT 'participant',
    -- 'host', 'participant', 'viewer'
  UNIQUE(meeting_id, user_id)
);
```

#### ActionItem (액션 아이템)
```sql
CREATE TABLE action_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  assignee_id UUID REFERENCES users(id),
  description TEXT NOT NULL,
  due_date DATE,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_action_items_assignee ON action_items(assignee_id);
CREATE INDEX idx_action_items_due_date ON action_items(due_date);
```

#### Template (템플릿)
```sql
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  content JSONB NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### AuditLog (감사 로그)
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
    -- 'login', 'create_meeting', 'change_role', 'delete_meeting' 등
  target_type VARCHAR(50),
    -- 'user', 'meeting', 'team' 등
  target_id UUID,
  metadata JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

#### AccessLog (접근 로그)
```sql
CREATE TABLE access_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  meeting_id UUID REFERENCES meetings(id),
  action VARCHAR(20) NOT NULL,
    -- 'view', 'edit', 'download'
  granted BOOLEAN NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_access_logs_meeting_id ON access_logs(meeting_id);
CREATE INDEX idx_access_logs_created_at ON access_logs(created_at);
```

---

## 5. API 엔드포인트

### 5.1 인증 (Auth)
```
POST   /api/auth/signup          # 회원가입
POST   /api/auth/login           # 로그인
POST   /api/auth/logout          # 로그아웃
POST   /api/auth/refresh         # 토큰 갱신
GET    /api/auth/me              # 현재 사용자 정보
```

### 5.2 회의록 (Meetings)
```
POST   /api/meetings                      # 회의록 생성
GET    /api/meetings                      # 회의록 목록 (필터링, 검색)
GET    /api/meetings/:id                  # 회의록 상세
PUT    /api/meetings/:id                  # 회의록 수정
DELETE /api/meetings/:id                  # 회의록 삭제 (휴지통)
POST   /api/meetings/:id/restore          # 휴지통에서 복구
DELETE /api/meetings/:id/permanent        # 영구 삭제

# 버전 관리
GET    /api/meetings/:id/versions         # 버전 목록
GET    /api/meetings/:id/versions/:ver    # 특정 버전 조회
POST   /api/meetings/:id/restore-version  # 특정 버전으로 복구
GET    /api/meetings/:id/diff?v1=5&v2=3   # 두 버전 비교

# 링크 관리
GET    /api/meetings/:id/references       # 이 회의록을 참조하는 목록
GET    /api/meetings/:id/links            # 이 회의록이 참조하는 목록
GET    /api/meetings/:id/delete-impact    # 삭제 영향도 분석

# 권한 관리
GET    /api/meetings/:id/permissions      # 권한 조회
PUT    /api/meetings/:id/permissions      # 권한 설정
```

### 5.3 검색 (Search)
```
GET    /api/search?q=keyword&project=&author=&date=&tags=
```

**쿼리 파라미터**:
- `q`: 검색 키워드
- `project`: 프로젝트 ID
- `author`: 작성자 ID
- `dateFrom`, `dateTo`: 날짜 범위
- `tags`: 태그 (콤마 구분)

### 5.4 템플릿 (Templates)
```
GET    /api/templates                          # 템플릿 목록
POST   /api/templates                          # 템플릿 생성
GET    /api/templates/:id                      # 템플릿 상세
PUT    /api/templates/:id                      # 템플릿 수정
DELETE /api/templates/:id                      # 템플릿 삭제
POST   /api/meetings/from-template/:templateId # 템플릿으로 회의록 생성
```

### 5.5 액션 아이템 (Action Items)
```
GET    /api/meetings/:id/actions          # 액션 아이템 목록
POST   /api/meetings/:id/actions          # 액션 아이템 추가
PUT    /api/actions/:id                   # 액션 아이템 수정
PUT    /api/actions/:id/complete          # 완료 처리
DELETE /api/actions/:id                   # 액션 아이템 삭제

GET    /api/my/actions                    # 내가 할당받은 액션 아이템
GET    /api/my/actions/overdue            # 마감 지난 액션 아이템
```

### 5.6 내보내기 (Export)
```
GET    /api/meetings/:id/export/md        # 마크다운 다운로드
GET    /api/meetings/:id/export/pdf       # PDF 다운로드
GET    /api/meetings/:id/export/docx      # Word 다운로드
```

### 5.7 관리자 - 회원 관리 (Admin Users)
```
GET    /api/admin/users                   # 전체 회원 목록
GET    /api/admin/users/:id               # 회원 상세
PUT    /api/admin/users/:id               # 회원 정보 수정
DELETE /api/admin/users/:id               # 회원 삭제
PATCH  /api/admin/users/:id/status        # 상태 변경
PATCH  /api/admin/users/:id/role          # 역할 변경
POST   /api/admin/users/bulk-role-change  # 일괄 역할 변경
GET    /api/admin/users/:id/activities    # 회원 활동 로그
```

### 5.8 관리자 - 팀 관리 (Admin Teams)
```
GET    /api/admin/teams                   # 전체 팀 목록
POST   /api/admin/teams                   # 팀 생성
GET    /api/admin/teams/:id               # 팀 상세
PUT    /api/admin/teams/:id               # 팀 수정
DELETE /api/admin/teams/:id               # 팀 삭제
POST   /api/admin/teams/:id/members       # 팀원 추가
DELETE /api/admin/teams/:id/members/:uid  # 팀원 제거
PATCH  /api/admin/teams/:id/leader        # 팀 리더 변경
```

### 5.9 관리자 - 프로젝트 관리 (Admin Projects)
```
GET    /api/admin/projects                # 전체 프로젝트 목록
POST   /api/admin/projects                # 프로젝트 생성
GET    /api/admin/projects/:id            # 프로젝트 상세
PUT    /api/admin/projects/:id            # 프로젝트 수정
DELETE /api/admin/projects/:id            # 프로젝트 삭제
POST   /api/admin/projects/:id/archive    # 프로젝트 아카이빙
```

### 5.10 관리자 - 회의록 관리 (Admin Meetings)
```
GET    /api/admin/meetings                # 전체 회의록 목록
GET    /api/admin/meetings/deleted        # 삭제된 회의록 목록
POST   /api/admin/meetings/:id/restore    # 회의록 복구
DELETE /api/admin/meetings/:id/force      # 강제 영구 삭제
GET    /api/admin/meetings/stats          # 회의록 통계
```

### 5.11 관리자 - 로그 및 감사 (Admin Logs)
```
GET    /api/admin/logs/access             # 접근 로그
GET    /api/admin/logs/audit              # 감사 로그
```

### 5.12 관리자 - 대시보드 (Admin Dashboard)
```
GET    /api/admin/dashboard/overview      # 전체 개요 통계
GET    /api/admin/dashboard/user-stats    # 회원 통계
GET    /api/admin/dashboard/meeting-stats # 회의록 통계
GET    /api/admin/dashboard/activity      # 활동 추이
```

---

## 6. 주요 화면 구성

### 6.1 메인 화면 (대시보드)
```
┌─────────────────────────────────────────────────────┐
│ MeetingNotes                [검색] [프로필▼]         │
├─────────────────────────────────────────────────────┤
│                                                     │
│ ⚡ 빠른 작업                                        │
│ [오늘 회의록 생성]  [템플릿에서 생성]                │
│                                                     │
│ 📌 최근 회의록                         [전체 보기→] │
│ ┌────────────────────────────────────────┐         │
│ │ Q4 전략 회의        1/11  진영화  🔓   │         │
│ │ 주간 스프린트 회고  1/10  홍길동  🔒   │         │
│ │ 1:1 미팅           1/09  김철수  🔐   │         │
│ └────────────────────────────────────────┘         │
│                                                     │
│ ✅ 내 액션 아이템                      [전체 보기→] │
│ ┌────────────────────────────────────────┐         │
│ │ [ ] 기획서 작성        마감: 1/20 🔴   │         │
│ │ [ ] 디자인 시안 작성   마감: 1/25 🟡   │         │
│ │ [✓] 서버 구축 완료     완료: 1/10      │         │
│ └────────────────────────────────────────┘         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 6.2 회의록 목록
```
┌─────────────────────────────────────────────────────┐
│ 회의록                                 [+ 새 회의록] │
├─────────────────────────────────────────────────────┤
│ 🔍 [검색_________________________]  [필터 ▼]        │
│                                                     │
│ 프로젝트: [전체▼]  작성자: [전체▼]  날짜: [이번주▼] │
│ 태그: [#기획] [#개발] [#디자인]                     │
│                                                     │
│ ┌────────────────────────────────────────────┐     │
│ │ 📝 Q4 전략 회의              1/11  🔓       │     │
│ │    진영화 | 프로젝트A | #기획 #전략         │     │
│ │    안건: 신규 서비스 론칭...                │     │
│ ├────────────────────────────────────────────┤     │
│ │ 📝 주간 스프린트 회고         1/10  🔒       │     │
│ │    홍길동 | 개발팀 | #회고 #스프린트       │     │
│ │    이번 주 완료 항목...                     │     │
│ └────────────────────────────────────────────┘     │
│                                                     │
│ [1] 2 3 4 5 ... 10 [다음]                           │
└─────────────────────────────────────────────────────┘
```

### 6.3 회의록 작성/편집
```
┌─────────────────────────────────────────────────────┐
│ [저장됨 ✓]  [공유] [삭제] [더보기 ▼]                │
├─────────────────────────────────────────────────────┤
│ 제목: [Q4 전략 회의_______________________________] │
│                                                     │
│ 프로젝트: [프로젝트A ▼]  태그: [#기획] [#전략] [+] │
│ 권한: [Team - 개발팀 ▼]                             │
│                                                     │
│ ┌─────────────────────────────────────────────┐   │
│ │ # Q4 전략 회의                              │   │
│ │                                             │   │
│ │ **일시**: 2025-01-11 14:00                  │   │
│ │ **참석자**: @진영화, @홍길동                │   │
│ │                                             │   │
│ │ ## 안건                                     │   │
│ │ 1. 신규 서비스 론칭 일정                    │   │
│ │                                             │   │
│ │ ## 논의 내용                                │   │
│ │ - 2월 15일 베타 론칭 합의                   │   │
│ │ - [관련 기획서] 참조                        │   │
│ │      └─> 팝업 미리보기                      │   │
│ │                                             │   │
│ │ ## 액션 아이템                              │   │
│ │ - [ ] @홍길동 기획서 작성 (마감: 1/20)     │   │
│ │                                             │   │
│ └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘

상단 툴바:
[B] [I] [U] [H1] [H2] [목록] [체크박스] [링크] [이미지] [코드]
```

### 6.4 회의록 상세 (읽기 모드)
```
┌─────────────────────────────────────────────────────┐
│ Q4 전략 회의                                        │
│ [편집] [공유] [삭제] [내보내기▼] [버전▼]            │
├─────────────────────────────────────────────────────┤
│ 작성: 진영화 | 1/11 14:00 | 프로젝트A | 🔓 전체공개 │
│ 태그: #기획 #전략 #Q4                               │
│                                                     │
│ **일시**: 2025-01-11 14:00                          │
│ **참석자**: 진영화, 홍길동, 김철수                  │
│                                                     │
│ ## 안건                                             │
│ 1. 신규 서비스 론칭 일정                            │
│ 2. 팀 구성 및 역할 분담                             │
│                                                     │
│ ## 논의 내용                                        │
│ 2월 15일 베타 론칭으로 합의. [Q3 회의록]과 연계하여 │
│ 진행 예정.                                          │
│                                                     │
│ ## 액션 아이템                                      │
│ ☑ @홍길동 기획서 작성 (마감: 1/20)                 │
│ ☐ @김철수 디자인 시안 (마감: 1/25)                 │
│                                                     │
│ ## 관련 회의록                                      │
│ - [Q3 회의록] 🔓                                   │
│ - [프로젝트 킥오프] 🔒                             │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 6.5 관리자 - 회원 관리
```
┌─────────────────────────────────────────────────────┐
│ Admin Dashboard              [진영화 (Admin) ▼]     │
├──────────┬──────────────────────────────────────────┤
│          │ 회원 관리           [+ 추가] [CSV업로드] │
│ 📊 대시보드│ ─────────────────────────────────────── │
│ 👥 회원관리│ 🔍 [검색] 역할:[전체▼] 상태:[전체▼]     │
│ 🏢 팀관리  │                                         │
│ 📁 프로젝트│ ☑ 이름  이메일    역할   팀   상태 작업 │
│ 📝 회의록  │ ─────────────────────────────────────── │
│ 🔐 권한설정│ ☑ 진영화 jin@...  Admin  Dev  🟢 [편집]│
│ 📋 로그조회│ ☑ 홍길동 hong@... Member PM   🟢 [편집]│
│          │ ☑ 김철수 kim@...  Viewer QA   🟢 [편집]│
│          │                                         │
│          │ [선택 항목 역할 변경 ▼]                 │
│          │                                         │
└──────────┴──────────────────────────────────────────┘
```

### 6.6 검색 결과
```
┌─────────────────────────────────────────────────────┐
│ 검색 결과: "프로젝트 A" - 5건                        │
├─────────────────────────────────────────────────────┤
│ 정렬: [관련도순 ▼]  필터: [날짜▼] [프로젝트▼]       │
│                                                     │
│ ┌────────────────────────────────────────────┐     │
│ │ 📝 프로젝트 A 킥오프 회의        1/11  🔓   │     │
│ │    진영화 | #기획 #킥오프                   │     │
│ │    ...우리는 **프로젝트 A**의 목표를...     │     │
│ ├────────────────────────────────────────────┤     │
│ │ 📝 프로젝트 A 주간 회의          1/10  🔒   │     │
│ │    홍길동 | #주간 #진행상황                 │     │
│ │    ...지난주 **프로젝트 A** 진행사항...     │     │
│ └────────────────────────────────────────────┘     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 7. 개발 우선순위

### Phase 1: MVP (2주) - 기본 기능
**목표**: 회의록 작성/조회/검색 가능한 최소 기능

- [ ] 프로젝트 초기 세팅
  - Next.js 16 프로젝트 생성
  - NestJS 프로젝트 생성
  - PostgreSQL 연결
  - Docker 환경 구성

- [ ] 인증 시스템
  - 회원가입/로그인
  - JWT 인증
  - 기본 역할 (Admin, Member, Viewer)

- [ ] 회의록 CRUD
  - 회의록 생성
  - 회의록 목록 조회
  - 회의록 상세 조회
  - 회의록 수정
  - 회의록 삭제 (하드 삭제)

- [ ] Tiptap 에디터 통합
  - 기본 에디터 설정
  - 마크다운 단축키
  - 자동 저장 (5분 간격)

- [ ] 템플릿 시스템
  - 기본 템플릿 (2025년 8월 스타일)
  - 템플릿으로 회의록 생성

- [ ] 마크다운 내보내기
  - .md 파일 다운로드

---

### Phase 2: 핵심 차별화 기능 (2주)
**목표**: Confluence/Jira 불편함 해소

- [ ] 링크 참조 추적
  - 회의록 간 링크 자동 감지
  - 참조 관계 DB 저장
  - 참조되는 회의록 목록 조회

- [ ] 소프트 삭제 시스템
  - 삭제 → 휴지통 이동
  - 휴지통 관리 페이지
  - 복구 기능

- [ ] 삭제 영향도 분석
  - 삭제 전 참조 회의록 목록 표시
  - 경고 모달

- [ ] 버전 관리
  - 자동 스냅샷 (5분 간격)
  - 버전 목록 조회
  - 특정 버전으로 복구

- [ ] 버전 비교 (Diff)
  - 두 버전 간 차이 하이라이트
  - 타임라인 슬라이더

- [ ] 기본 권한 시스템
  - Public/Team/Private 권한
  - 권한 체크 미들웨어

---

### Phase 3: 관리자 기능 (2주)
**목표**: 관리자가 전체 시스템 관리 가능

- [ ] 관리자 대시보드
  - 전체 통계 (회원, 회의록, 활동)
  - 활동 추이 차트

- [ ] 회원 관리
  - 전체 회원 목록
  - 회원 상세 정보
  - 역할 변경
  - 상태 관리 (활성/비활성)
  - 일괄 역할 변경

- [ ] 팀 관리
  - 팀 생성/수정/삭제
  - 팀원 추가/제거
  - 팀 리더 지정

- [ ] 프로젝트 관리
  - 프로젝트 생성/수정/삭제
  - 프로젝트 권한 설정

- [ ] 전체 회의록 관리
  - 모든 회의록 조회
  - 휴지통 관리
  - 회의록 통계

- [ ] 로그 조회
  - 접근 로그
  - 감사 로그 (Audit Log)

---

### Phase 4: 고급 기능 (2주)
**목표**: UX 개선 및 고급 기능

- [ ] 링크 인라인 프리뷰
  - 마우스 오버 시 팝업
  - 미리보기 UI

- [ ] 사이드 패널 뷰
  - 링크 클릭 시 사이드 패널
  - 여러 개 동시 열람

- [ ] 링크 상태 표시
  - 🔓🔒🔐⚠️🗑️ 아이콘 표시
  - 권한 정보 툴팁

- [ ] 자동 정리 Cron Job
  - 매일 자정 실행
  - 30일 지난 휴지통 항목 영구 삭제
  - 깨진 링크 자동 업데이트
  - 검색 인덱스 최적화

- [ ] 고급 검색
  - 필터 조합
  - 검색 결과 하이라이트
  - 검색어 자동완성

- [ ] 통계 대시보드
  - 회의록 생성 추이 차트
  - 팀별/프로젝트별 통계
  - 가장 많이 참조된 회의록

---

### Phase 5: 최적화 및 마무리 (1주)
**목표**: 성능 및 UX 개선

- [ ] 성능 최적화
  - 쿼리 최적화
  - 인덱스 튜닝
  - 페이지네이션 개선
  - 이미지 lazy loading

- [ ] 검색 성능 개선
  - PostgreSQL Full-Text Search 최적화
  - 검색 결과 캐싱

- [ ] UI/UX 개선
  - 반응형 디자인
  - 로딩 상태 표시
  - 에러 핸들링 개선
  - 접근성 (a11y) 개선

- [ ] 테스트
  - 단위 테스트
  - E2E 테스트 (주요 플로우)

---

## 8. 추후 개발 사항

### 8.1 보안 강화 (우선순위 높음)
> 현재는 기능 구현에 집중하고, 추후 보안 강화 예정

- [ ] **인증/인가 강화**
  - Refresh Token 로테이션
  - CSRF 토큰
  - Rate Limiting (로그인 시도 제한)
  - 비밀번호 정책 (최소 길이, 복잡도)

- [ ] **데이터 보호**
  - 비밀번호 bcrypt 해싱 (salt round 12)
  - 민감 정보 암호화 (AES-256)
  - HTTPS 강제

- [ ] **입력 검증**
  - SQL Injection 방지
  - XSS 방지 (입력 sanitization)
  - 파일 업로드 검증 (확장자, 크기)

- [ ] **감사 추적**
  - 모든 중요 작업 로그 기록
  - IP 주소 및 User-Agent 기록
  - 이상 접근 탐지

---

### 8.2 협업 기능
- [ ] 실시간 동시 편집
  - WebSocket 기반 멀티 커서
  - 충돌 해결 (Operational Transformation)

- [ ] 댓글 기능
  - 인라인 댓글
  - 스레드 댓글
  - 댓글 알림

- [ ] 알림 시스템
  - @mention 알림
  - 액션 아이템 마감일 알림
  - 회의록 공유 알림

---

### 8.3 고급 기능
- [ ] **AI 기능**
  - 회의록 자동 요약
  - 액션 아이템 자동 추출
  - 관련 회의록 추천

- [ ] **캘린더 연동**
  - Google Calendar 연동
  - 회의 일정에서 바로 회의록 생성

- [ ] **Slack/Teams 연동**
  - 회의록 공유
  - 봇 명령어

- [ ] **모바일 앱**
  - React Native 앱
  - 오프라인 모드

---

### 8.4 성능 및 인프라
- [ ] **캐싱**
  - Redis 캐싱
  - CDN (이미지, 정적 파일)

- [ ] **검색 엔진**
  - Elasticsearch 또는 MeiliSearch
  - 더 빠르고 정교한 검색

- [ ] **모니터링**
  - 성능 모니터링 (APM)
  - 에러 트래킹 (Sentry)
  - 로그 관리 (ELK Stack)

- [ ] **백업 자동화**
  - 데이터베이스 자동 백업
  - S3 백업 저장

---

## 9. 예상 기술 이슈 및 해결 방안

### 9.1 에디터 관련
**이슈**: Tiptap JSON ↔ 마크다운 변환 시 정보 손실
**해결**: 
- Tiptap JSON을 원본으로 저장
- 검색용으로만 플레인 텍스트 저장
- 내보내기 시 커스텀 변환기 작성

### 9.2 링크 추적
**이슈**: 에디터 내 링크 자동 감지 및 DB 저장
**해결**:
- 저장 시 content JSON 파싱
- 링크 패턴 감지 (정규식)
- MeetingLink 테이블 업데이트

### 9.3 버전 관리
**이슈**: 버전이 많아지면 DB 용량 증가
**해결**:
- 중요 버전만 저장 (사용자가 명시적으로 저장)
- 자동 버전은 30일 후 삭제
- 버전 압축 (JSONB compression)

### 9.4 검색 성능
**이슈**: 회의록이 많아지면 검색 느려짐
**해결**:
- PostgreSQL Full-Text Search (GIN 인덱스)
- 검색 결과 캐싱
- 필요시 Elasticsearch 도입

### 9.5 권한 체크 성능
**이슈**: 매 요청마다 권한 체크 오버헤드
**해결**:
- 권한 정보 JWT에 포함
- Redis 캐싱
- 효율적인 쿼리 (JOIN 최소화)

---

## 10. 배포 계획

### 10.1 개발 환경
```
Local Development
- Docker Compose로 전체 스택 실행
- Hot reload 개발 환경
```

### 10.2 스테이징 환경
```
Staging Server
- 개발 완료된 기능 테스트
- 실제 데이터와 유사한 테스트 데이터
```

### 10.3 프로덕션 환경
```
Production (Phase 1 완료 후)
- AWS EC2 또는 Vercel (Next.js)
- RDS (PostgreSQL)
- S3 (파일 저장)
- CloudFront (CDN)
```

---

## 11. 마무리

이 문서는 회의록 웹서비스의 전체 기능 명세서입니다.

**핵심 목표**:
1. Confluence/Jira의 불편함 해소
2. 빠르고 직관적인 UX
3. 투명한 권한 관리
4. 안전한 삭제 및 복구 시스템

**개발 원칙**:
- 먼저 기능 구현, 보안은 추후 강화
- MVP부터 점진적 개선
- 사용자 피드백 반영

---

**작성일**: 2025-01-11  
**작성자**: 진영화  
**버전**: 1.0
