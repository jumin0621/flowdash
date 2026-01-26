// totalTasks count
const totalCountEl = document.querySelector(".totalCount");

// todo count
const todoCountEl = document.querySelector(".todoCount");

// progress count
const progressCountEl = document.querySelector(".progressCount");

// done count
const doneCountEl = document.querySelector(".doneCount");

// achievement count
const achievementCounetEl = document.querySelector(".achCount");

export function updateDashCount({ total, todo, doing, done, achievement }) {
  if (totalCountEl) totalCountEl.textContent = String(total ?? 0);
  if (todoCountEl) todoCountEl.textContent = String(todo ?? 0);
  if (progressCountEl) progressCountEl.textContent = String(doing ?? 0);
  if (doneCountEl) doneCountEl.textContent = String(done ?? 0);

  if (achievementCounetEl) {
    achievementCounetEl.textContent =
      achievement === "-" ? "-" : `${achievement}%`;
  }
}
