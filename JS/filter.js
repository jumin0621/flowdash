import { render } from "./todos.js";

// 기간 필터 이벤트
const periodSelect = document.querySelector(".select-filter");

export let currentPeriod = periodSelect?.value ?? "total";

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

if (periodSelect) {
  periodSelect.addEventListener("change", (e) => {
    currentPeriod = e.target.value; // total | today | 7day
    render();
  });
}
