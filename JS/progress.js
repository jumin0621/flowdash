export function updateProgress(todoCount, doingCount, doneCount) {
    const progressBar = document.querySelector(".progressBar");
    const progressFill = document.querySelector("#progressFill");
    const progressChar = document.querySelector("#progressChar");
    const progressPct = document.querySelector("#progressPct");

    if (!progressBar || !progressFill || !progressChar || !progressPct) return;

    const total = todoCount + doingCount + doneCount;
    const percent = total === 0 ? 0 : Math.round((doneCount / total) * 100);

    progressPct.textContent = `${percent}%`;
    progressFill.style.width = `${percent}%`;

    requestAnimationFrame(() => {
        const barWidth = progressBar.getBoundingClientRect().width;

        if (!barWidth) return;   // 안전장치

        const leftPx = (barWidth * percent) / 100;
        progressChar.style.left = `${leftPx}px`;
    });
}
