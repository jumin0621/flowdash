
<br/>
<br/>

# 0. Getting Started (서비스 URL)
```bash
https://jumin0621.github.io/flowdash/
```

<br/>
<br/>

# 1. Project Overview (프로젝트 개요)
- 프로젝트명: To-do List
- 프로젝트 설명
  - 일정을 등록하고 대시보드 통계를 통해 달성률을 확인할 수 있다.
  - 위인들의 명언과 하루 한마디를 통해 동기부여를 제공한다.

<br/>
<br/>

# 2. Team Members (팀원)
| 신주민 | 장미진 | 신진호 | 
|:------:|:------:|:------:|
| <img src="https://github.com/user-attachments/assets/1a6ccf79-2dcb-4977-8525-40158da4f66f" alt="신주민" width="150"> | <img src="https://github.com/user-attachments/assets/004573de-279e-49b2-a6dd-a9e7d13a6f20" alt="장미진" width="150"> | <img src="https://github.com/user-attachments/assets/2c4b5cf7-47e7-4174-96eb-2c79208f3790" alt="신진호" width="150"> |
| PL | FE | FE |
| [GitHub](https://github.com/jumin0621) | [GitHub](https://github.com/Winter-Haeum) | [GitHub](https://github.com/sjh83) |

<br/>
<br/>

# 3. Features (주요 기능)
- **사용자 정보 및 개인**:
  - 시간대별 인사 문구출력
  ```bash
  - 05–11: 좋은 아침이에요
  - 11–17: 좋은 오후에요
  - 17–22: 좋은 저녁이에요
  - 그 외: 안녕하세요
  ```
  - 닉네임 수정
  ```bash
  - 인사 문구에 닉네임 표시 (예: 좋은 아침이에요, FlowDash님)
  - 닉네임 영역 클릭 시 인라인 수정 가능
  - Enter 또는 blur 시 저장
  - 빈 값 입력 시 이전 값 또는 기본값으로 복원
  - 닉네임은 LocalStorage에 저장
  - 초기 닉네임 기본값: FlowDash
  - 선택 사항: 최초 1회 랜덤 닉네임 생성 가능
  ```
  - 다크모드/라이트모드 토글
  ```bash
  - 해/달 아이콘 클릭 시 라이트 ↔ 다크 모드 전환
  - 선택된 테마는 LocalStorage에 저장되어 새로고침 후에도 유지
  ```

- **동기부여**:
  - “오늘도 한 칸씩” 한 줄 다짐 저장/삭제.
  ```bash
  - 입력칸 오른쪽에 저장/삭제 버튼 제공
  - 저장 시 “저장됨” 문구가 잠깐 표시 후 사라짐
  - 삭제 시 “삭제됨” 문구가 잠깐 표시 후 사라짐
  - 다짐 문구는 LocalStorage에 저장되어 유지
  ```
  - 오늘의 명언 자동 표시
  ```bash
  - 하루 1회 자동 변경
  - 명언 오른쪽에 위인의 이름 함께 표시
  ```

- **할 일 관리 (Core)**:
  - “+ 새 할 일” 버튼 → 모달 입력
  ```bash
  - 제목: 필수 입력
  - 내용: 선택 입력
  - 우선순위: 높음 / 중간 / 낮음 선택 가능
  - 상태: 할 일 / 진행 중 / 완료 선택 가능
  - 저장하기 버튼 색상은 오늘의 다짐 저장 버튼과 동일한 계열 사용
  ```
  - 우선순위 UI 규칙
  ```bash
  - 테두리 색상: #8b7dff
  - 배경색: 연보라 (opacity 적용)
  ```
  - 할 일 카드 구성(칸반보드)
  ```bash
  - 우선순위 라벨 표시 (낮음 / 중간 / 높음)
  ```
  - 삭제
  ```bash
  - 개별 카드 X 버튼 클릭 시 삭제 확인 모달 표시
  - 문구: “정말 삭제하시겠습니까?”
  - 버튼: [확인], [취소]
  - 확인 시 삭제, 취소 시 모달만 닫힘
  - 전체 삭제 및 전체 데이터 초기화 기능도 동일한 방식의 모달 사용
  ```
  - 날짜 표시 규칙
  ```bash
  - 생성 시: 입력 일자 표시 (YYYY. MM. DD HH:mm)
  - 수정 또는 진행 중 상태 변경 시: 수정 일자 추가 표시 (YYYY. MM. DD HH:mm)
  - 완료 상태 변경 시: 수정일자 대신 완료일자 표시
  ```
  - 빈 데이터 처리
  ```bash
  - 각 컬럼에 데이터가 없을 경우 “비어있음” 상태 UI 표시
  ```
  - 데이터 모델 구조
  ```bash
  - id
  - title
  - content
  - priority
  - status
  - createdAt
  - updatedAt
  - completedAt
  ```

- **필터/정렬/통계**:
  - 필터 드롭다운 3종
  ```bash
  - 기간: 전체 / 오늘 / 7일
  - 우선순위: 높음 / 중간 / 낮음
  - 정렬: 제목 오름차순 / 제목 내림차순
  ```
  - 검적용된 필터 표시 (Active Filter)
  ```bash
  - 기간에서 “오늘” 선택 시 하단에 “기간: 오늘” 뱃지 형식 표시
  - 위치: “전체 데이터 초기화” 버튼 왼쪽
  - 기본값(설정 없음)일 경우 표시하지 않음
  ```
  - 달성률 게이지 + 게이지에 맞춰 토끼아이콘 이동
  ```bash
  - 전체 할 일 대비 완료 비율(%) 계산하여 게이지 표시한다.
  - 토끼 아이콘이 퍼센티지에 맞춰 이동한다.
  - 상단 통계 영역은 다음 항목을 표시한다.
    # Total Tasks(전체 Todo 개수)
    # To Do(TODO 개수)
    # In Progress(DOING 개수)
    # Done(DONE 개수)
    # Achievement(달성률 %)
  - Achievement 계산식은 (DONE / 전체) * 100이다.
  - 전체 Todo가 0개일 경우 Achievement는 “-”로 표시한다
  ```

- **반응형 UI**:
  - 모바일 화면부터 1열 레이아웃을 기준으로 반응형 UI를 구성한다
  - 반응형 기준
  ```bash
  - @media (max-width: 767px) 
  - @media (max-width: 1199px)
  ```

- **공통 저장 규칙 (LocalStorage Keys)**:
  - LocalStorage 저장 키는 다음을 사용한다
  ```bash
  - flowdash-todos 할일
  - flowdash-theme 테마
  - flowdash-nickname 닉네임
  ```
  - 새로고침/재방문 시 LocalStorage에서 로드하여 최신 상태로 렌더링한다

<br/>
<br/>

# 4. Tasks & Responsibilities (작업 및 역할 분담)
|  |  |  |
|----------------|-----------------|-----------------|
| 신주민 |  <img src="https://github.com/user-attachments/assets/1a6ccf79-2dcb-4977-8525-40158da4f66f" alt="신주민" width="100"> | <ul><li>팀 리딩</li><li>UI디자인 및 구현</li><li>UX개발</li></li><li>기능구현<br>- 칸반보드, 할 일 등록 모달영역, 데이터 삭제 및 초기화</li></ul>     |
| 장미진 |  <img src="https://github.com/user-attachments/assets/004573de-279e-49b2-a6dd-a9e7d13a6f20" alt="장미진" width="100"> | <ul><li>UI기획</li><li>UI디자인 및 구현</li><li>UX개발</li></li><li>기능구현<br>- 인사말, 명언, 다크모드/라이트모드 테마</li></ul> |
| 신진호 |  <img src="https://github.com/user-attachments/assets/2c4b5cf7-47e7-4174-96eb-2c79208f3790" alt="신진호" width="100"> | <ul><li>UI기획</li><li>UI디자인 및 구현</li><li>UX개발</li><li>기능구현<br>- 통계 대시보드, 검색/필터영역</li></ul>  |

<br/>
<br/>

# 5. Technology Stack (기술 스택)
## 5.1 Frontend
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" width="100"> | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" width="100"> | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="100"> |
|:-----:|:-----:|:----------:|
| HTML5 | CSS3  | JavaScript |

<br/>

## 5.2 Tools
| <img src="https://github.com/user-attachments/assets/fb7aae51-5160-4ebe-bb9a-895132d65be8" width="100"> | <img src="https://github.com/user-attachments/assets/183c3748-d2d9-418d-94b1-1cdd35992d2a" alt="discord" width="100"> |
|:------:|:-----:|
| vsCode | Figma |

<br/>

## 5.3 Cooperation
<img src="https://github.com/user-attachments/assets/2a1df8d3-c923-40ac-a514-c5b5decf87f5" alt="gitgub" width="100"> | <img src="https://github.com/user-attachments/assets/996905e5-0252-4729-840c-9babef6d42f4" alt="gitgub" width="100"> |
|:------:|:-------:|
| GitHub | Discord |

<br/>

# 6. Project Structure (프로젝트 구조)
```bash
flowdash/
├── README.md                # 프로젝트 설명
├── index.html/              # HTML 템플릿 파일
│                       
├── CSS/
│   ├── board.css            # 칸반보드 스타일
│   ├── common.css           # 공통 스타일 정의
│   ├── dashBoard.css        # 통계 대시보드 스타일
│   ├── filter.css           # 검색/필터 스타일
│   ├── greeting.css         # 인사말 스타일
│   ├── modal.css            # 할일 등록 모달 스타일
│   ├── motivation.css       # 명언 스타일
│   ├── reset.css            # CSS 초기화
│   ├── responsive.css       # 반응형 UI
│   └── theme.css            # 다크/라이트 테마 스타일
│  
├── JS/
│   ├── api.js               # 인사말
│   ├── dashboard.js         # 통계 대시보드
│   ├── filter.js            # 검색/정렬
│   ├── main.js              # 엔트리 
│   ├── modal.js             # 닉네임
│   ├── render.js            # 명언
│   ├── store.js             # 스토리지키
│   ├── todos.js             # 투두리스트(칸반보드)
│   └── progress.js          # 달성률게이지
│  
└── img/                     # 이미지

```

<br/>
<br/>

# 7. Development Workflow (개발 워크플로우)
## 브랜치 전략 (Branch Strategy)
Github를 기반으로 하며, 다음과 같은 브랜치를 사용합니다.

- Main Branch
  - 최종 배포 상태의 코드만 유지합니다.

- Dev Branch
  - 모든 배포는 이 브랜치에서 이루어집니다.
  
- {기능명} Branch
  - 팀원 각자의 개발 브랜치입니다.
  - 모든 기능 개발은 이 브랜치에서 이루어집니다.

<br/>
<br/>

