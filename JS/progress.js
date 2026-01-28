let lastCounts = { todo: 0, doing: 0, done: 0 };
let resizeBound = false;

// 폭죽 상태
let was100 = false;
let fireworkTimeoutIds = [];

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

    // 100% 도달 순간에만 폭죽(여러 번)
    const fireworksLayer = progressChar.querySelector(".fireworks-layer");

    if (percent === 100 && !was100 && fireworksLayer) {
        was100 = true;

        clearFireworkTimeouts();

        scheduleFirework(fireworksLayer, 0);
        scheduleFirework(fireworksLayer, 700);
        scheduleFirework(fireworksLayer, 1400);
        scheduleFirework(fireworksLayer, 2100);
        scheduleFirework(fireworksLayer, 2800);
        scheduleFirework(fireworksLayer, 3500);
    }

    if (percent !== 100) {
        was100 = false;

        clearFireworkTimeouts();
        if (fireworksLayer) fireworksLayer.classList.remove("is-on");
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

// 폭죽 유틸
function scheduleFirework(layer, delay) {
    const id = setTimeout(() => {
        popFirework(layer);
    }, delay);

    fireworkTimeoutIds.push(id);
}

function clearFireworkTimeouts() {
    for (const id of fireworkTimeoutIds) {
        clearTimeout(id);
    }
    fireworkTimeoutIds = [];
}

function popFirework(layer) {
    layer.classList.remove("is-on");
    void layer.offsetWidth; // 애니메이션 재시작
    layer.classList.add("is-on");

    const id = setTimeout(() => {
        layer.classList.remove("is-on");
    }, 900);

    fireworkTimeoutIds.push(id);
}
