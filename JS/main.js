// 다른 js 파일에서 불러오기
import { LS_KEYS, getItem, setItem, removeItem, todayKey } from "./store.js";

import {
  showGreeting,
  showNickname,
  showNickIcon,
  showTodayDate,
  cleanNickname,
  applyTheme,
  showMyLine,
} from "./render.js";

import { pickRandom, greetingList, nickIconList } from "./api.js";

import { bindNicknameEdit } from "./modal.js";

// 최초 테마 결정
function initTheme() {
  const saved = getItem(LS_KEYS.THEME);

  if (saved === "dark" || saved === "light") {
    applyTheme(saved);
    return;
  }

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const initial = prefersDark ? "dark" : "light";

  setItem(LS_KEYS.THEME, initial);
  applyTheme(initial);
}

// 버튼 클릭 시 테마 전환
function bindThemeToggle() {
  const toggleBtn = document.querySelector("#themeToggleBtn");
  if (!toggleBtn) return;

  toggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");

    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    setItem(LS_KEYS.THEME, nextTheme);
    applyTheme(nextTheme);
  });
}

// 시간대별 인사말 랜덤 출력
function initGreeting() {
  const hour = new Date().getHours();

  const greetingPool = greetingList(hour);
  const greeting = pickRandom(greetingPool);

  showGreeting(greeting);
}

// 닉네임 아이콘 랜덤 출력
function initNickIcon() {
  const iconPool = nickIconList();
  const icon = pickRandom(iconPool);

  showNickIcon(icon);
}

// 닉네임 초기화
function initNickname() {
  const saved = getItem(LS_KEYS.NICKNAME);

  if (saved) {
    showNickname(saved);
    return;
  }

  const nicknameElement = document.querySelector("#nicknameText");
  const raw = nicknameElement ? nicknameElement.textContent : "";
  const initial = cleanNickname(raw);

  setItem(LS_KEYS.NICKNAME, initial);
  showNickname(initial);
}

// 다짐 박스 
function initMyLine() {
    const myLineInput = document.querySelector("#myLineInput");
    const myLineSaveBtn = document.querySelector("#myLineSaveBtn");
    const myLineClearBtn = document.querySelector("#myLineClearBtn");
    const myLineStatus = document.querySelector("#myLineStatus");

    if (!myLineInput || !myLineSaveBtn || !myLineClearBtn) return;

    const SAVED_COLOR = "#8b7dff";

    function getEditColor() {
        const isDark = document.documentElement.getAttribute("data-theme") === "dark";
        return isDark ? "#ffffff" : "#111111";
    }

    function getMyLineKey() {
        return `${LS_KEYS.MYLINE}:${todayKey()}`;
    }

    const storageKey = getMyLineKey();

    function applyMyLineStyle(isSaved) {
        if (isSaved) {
            myLineInput.style.textAlign = "center";
            myLineInput.style.color = SAVED_COLOR;
        } else {
            myLineInput.style.textAlign = "left";
            myLineInput.style.color = getEditColor();
        }
    }

    let statusTimerId = null;

    function setStatus(message) {
        if (!myLineStatus) return;

        myLineStatus.textContent = message;

        window.clearTimeout(statusTimerId);
        statusTimerId = window.setTimeout(() => {
            myLineStatus.textContent = "";
        }, 1500);
    }

    const saved = getItem(storageKey) || "";
    showMyLine(saved);
    applyMyLineStyle(Boolean(saved.trim()));

    function saveMyLine() {
        const text = myLineInput.value.trim();

        if (!text) {
            showMyLine("");
            applyMyLineStyle(false);
            setStatus("빈 문장은 저장 불가");
            myLineInput.focus();
            return;
        }

        setItem(storageKey, text);
        setStatus("저장 완료");

        applyMyLineStyle(true);
        myLineInput.blur();
    }

    function clearMyLine() {
        removeItem(storageKey);
        showMyLine("");
        setStatus("삭제 완료");

        applyMyLineStyle(false);
        myLineInput.blur();
    }

    myLineInput.addEventListener("focus", () => {
        applyMyLineStyle(false);
    });

    myLineSaveBtn.addEventListener("click", saveMyLine);
    myLineClearBtn.addEventListener("click", clearMyLine);

    myLineInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            saveMyLine();
        }
    });
}

async function initDailyQuote() {
    const today = todayKey();
    const storageKey = `${LS_KEYS.DAILY_QUOTE}:${today}`;

    const savedRaw = getItem(storageKey);

    if (savedRaw) {
        try {
            const savedQuote = JSON.parse(savedRaw);
            showDailyQuote(savedQuote);
            return;
        } catch (error) {
            // ✅ 저장값이 깨졌으면 제거하고 새로 받아오기
            removeItem(storageKey);
        }
    }

    try {
        const quote = await fetchQuote();
        setItem(storageKey, JSON.stringify(quote));
        showDailyQuote(quote);
    } catch (error) {
        console.error("명언 불러오기 실패:", error);
        showDailyQuote({
            text: "“오늘도 충분히 잘하고 있어요.”",
            meta: "- FlowDash"
        });
    }
}

// [실행부] 앱 시작 시 동작

initTheme(); // 테마 먼저
bindThemeToggle(); // 테마 버튼 연결

initGreeting(); // 인사말
initNickIcon(); // 아이콘
initNickname(); // 닉네임

showTodayDate(); // 날짜 표시
bindNicknameEdit(); // 닉네임 수정 기능
initMyLine();
