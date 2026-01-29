let lastCounts = { todo: 0, doing: 0, done: 0 };
let resizeBound = false;

// 폭죽 상태(100% 1회 트리거 + 연속 재생용)
let was100 = false;
let fireworkEndTimeoutId = null;

export function updateProgress(todoCount, doingCount, doneCount) {
    // 최신 카운트 저장
    lastCounts = { todo: todoCount, doing: doingCount, done: doneCount };

    const progressBar = document.querySelector(".progressBar");
    const progressFill = document.querySelector("#progressFill");
    const progressChar = document.querySelector("#progressChar");
    const progressPct = document.querySelector("#progressPct");

    if (!progressBar || !progressFill || !progressChar || !progressPct) return;

    // 리사이즈 시 다시 계산
    if (!resizeBound) {
        resizeBound = true;

        window.addEventListener("resize", () => {
            requestAnimationFrame(() => {
                updateProgress(lastCounts.todo, lastCounts.doing, lastCounts.done);
            });
        });
    }

    const total = todoCount + doingCount + doneCount;
    const percent = total === 0 ? 0 : Math.round((doneCount / total) * 100);

    const fireworksLayer = progressChar.querySelector(".fireworks-layer");

    if (percent === 100 && !was100 && fireworksLayer) {
        was100 = true;

        stopFireworks();              
        fireworksLayer.classList.add("is-on");

        // 지속시간
        const DURATION_MS = 2500;

        fireworkEndTimeoutId = setTimeout(() => {
            fireworksLayer.classList.remove("is-on");
            fireworkEndTimeoutId = null;
        }, DURATION_MS);
    }

    if (percent !== 100) {
        was100 = false;
        if (fireworksLayer) fireworksLayer.classList.remove("is-on");
        stopFireworks();
    }

    // 게이지/퍼센트 UI 업데이트
    progressPct.textContent = `${percent}%`;
    progressFill.style.width = `${percent}%`;
    progressBar.setAttribute("aria-valuenow", String(percent));

    // 토끼 위치 업데이트
    requestAnimationFrame(() => {
        const barWidth = progressBar.getBoundingClientRect().width;
        const x = (barWidth * percent) / 100;

        const leftPx = Math.max(0, Math.min(x, barWidth));
        progressChar.style.left = `${leftPx}px`;
    });
}

function stopFireworks() {
    if (fireworkEndTimeoutId) {
        clearTimeout(fireworkEndTimeoutId);
        fireworkEndTimeoutId = null;
    }
}
