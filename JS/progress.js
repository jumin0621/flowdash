let lastCounts = { todo: 0, doing: 0, done: 0 };
let resizeBound = false;

export function updateProgress(todoCount, doingCount, doneCount) {
    lastCounts = { todo: todoCount, doing: doingCount, done: doneCount };

    const progressBar = document.querySelector(".progressBar");
    const progressFill = document.querySelector("#progressFill");
    const progressChar = document.querySelector("#progressChar");
    const progressPct = document.querySelector("#progressPct");

    if (!progressBar || !progressFill || !progressChar || !progressPct) return;

    if (!resizeBound) {
        resizeBound = true;

        window.addEventListener("resize", () => {
            // 레이아웃이 바뀐 뒤에 다시 계산(DevTools 토글 포함)
            requestAnimationFrame(() => {
                updateProgress(lastCounts.todo, lastCounts.doing, lastCounts.done);
            });
        });
    }

    const total = todoCount + doingCount + doneCount;
    const percent = total === 0 ? 0 : Math.round((doneCount / total) * 100);

    progressPct.textContent = `${percent}%`;
    progressFill.style.width = `${percent}%`;
    progressBar.setAttribute("aria-valuenow", String(percent));

    // 레이아웃 확정 후 계산(한 프레임 늦춤)
    requestAnimationFrame(() => {
        const barWidth = progressBar.getBoundingClientRect().width;
        const rabbitWidth = progressChar.getBoundingClientRect().width || 0;

        const x = (barWidth * percent) / 100;
        const leftPx = Math.max(0, Math.min(x, barWidth)); // (기존 clamp 로직 있으면 그거 유지)

        progressChar.style.left = `${leftPx}px`;
    });
}
