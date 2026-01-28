import { render } from "./todos.js";

// 기간 필터 이벤트 변수
const periodSelect = document.querySelector(".select-filter");
// 우선순위 필터 이벤트 변수
const prioritySelect = document.querySelector(".priority-filter");
// 제목 정렬 필터 이벤트 변수
const titleSortSelect = document.querySelector(".title-sort");
// 검색창 이벤트 변수
const searchInput = document.querySelector(".search");
console.log("searchInput:", searchInput);

export let currentPeriod = periodSelect?.value ?? "total";
export let currentPriority = prioritySelect?.value ?? "priority";
export let currentTitle = titleSortSelect?.value ?? "nomal-title";
export let currentKeyword = "";

// 기간 필터 정렬 함수
export function filterPeriod(list, period) {
  if (period === "total") return list;

  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (period === "today") {
    const startTomorrow = new Date(startToday);
    startTomorrow.setDate(startTomorrow.getDate() + 1);
    // 적용 확인용 콘솔
    console.log("TODAY 기준");
    console.log("startToday:", startToday);
    console.log("startTomorrow:", startTomorrow);

    return list.filter((t) => {
      const created = new Date(t.createdAt);
      return created >= startToday && created < startTomorrow;
    });
  }

  if (period === "7day") {
    const sevenDays = new Date(startToday);
    sevenDays.setDate(sevenDays.getDate() - 6);
    // 7일 기간필터 확인용 콘솔
    console.log("7day 시작:", sevenDays);
    console.log("지금:", now);

    return list.filter((t) => {
      const created = new Date(t.createdAt);
      return created >= sevenDays && created <= now;
    });
  }
  return list;
}
// priority select 값을 todos.priority로 변경------------------------------
function nomalPriority(value) {
  if (value === "height") return "high";
  if (value === "middle") return "mid";
  if (value === "low") return "low";
  return "all";
}
// 우선순위 필터 함수---------------------------------------------------
export function filterPriority(list, priorityValue) {
  const pri = nomalPriority(priorityValue);
  if (pri === "all") return list;
  return list.filter((t) => t.priority === pri);
}

// 제목 정렬 필터 함수-------------------------------------------
export function sortTitle(list, sortType) {
  if (sortType === "nomal-title") return list; // 정렬 안함

  const titleCopy = [...list]; // sort 원본 보호
  titleCopy.sort((a, b) => {
    const A = (a.title ?? "").toLowerCase(); // a가 없으면 빈문자열
    const B = (b.title ?? "").toLowerCase(); // b가 없으면 빈문자열

    return sortType === "up-sort" ? A.localeCompare(B) : B.localeCompare(A); // localCompare: 문자열비교 메서드 음수 → 앞
  });
  return titleCopy;
}

// 기간및 우선순위 정렬 결과내에서 검색-----------------------------------------------
export function filterKeyword(list, keyword) {
  const key = (keyword ?? "").trim().toLowerCase();

  if (!key) return list;

  return list.filter((todo) => {
    const title = (todo.title ?? "").toLowerCase();
    const content = (todo.content ?? "").toLowerCase();

    return title.includes(key) || content.includes(key);
  });
}

// select 이벤트 체인지==============================================================
// 기간 정렬
if (periodSelect) {
  periodSelect.addEventListener("change", (e) => {
    currentPeriod = e.target.value; // total | today | 7day
    render();
  });
}
// 우선순위
if (prioritySelect) {
  prioritySelect.addEventListener("change", (e) => {
    currentPriority = e.target.value; // 전체우선순위 || 높음 || 중간 || 낮음
    console.log("select value:", e.target.value);
    console.log("mapped:", nomalPriority(e.target.value));
    render();
  });
}
// 제목 정렬
if (titleSortSelect) {
  titleSortSelect.addEventListener("change", (e) => {
    currentTitle = e.target.value; // 제목 정렬 || 오름차순 || 내림차순
    render();
  });
}
// 검색창
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    currentKeyword = e.target.value.trim();
    render();
  });
}
// 검색창 x 버튼 초기화
const xbtn = document.querySelector(".xbtn");
xbtn.addEventListener("click", () => {
  console.log("X 클릭됨");
  searchInput.value = "";
  currentKeyword = "";
  render();
  searchInput.focus();
});
