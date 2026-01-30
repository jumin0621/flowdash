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
  showDailyQuote,
} from "./render.js";

import { pickRandom, greetingList, nickIconList, fetchQuote } from "./api.js";

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
    const myLineActionBtn = document.querySelector("#myLineSaveBtn"); // ✅ 하나로 통일

    if (!myLineInput || !myLineActionBtn) return;

    const SAVED_COLOR = "#8b7dff";

    function getEditColor() {
        const isDark = document.documentElement.getAttribute("data-theme") === "dark";
        return isDark ? "#ffffff" : "#111111";
    }

    const storageKey = LS_KEYS.MYLINE;

    function applyMyLineStyle(isSaved) {
        if (isSaved) {
            myLineInput.style.textAlign = "center";
            myLineInput.style.color = SAVED_COLOR;
        } else {
            myLineInput.style.textAlign = "left";
            myLineInput.style.color = getEditColor();
        }
    }

// 버튼 상태 토글 (저장 ↔ 삭제)
function setButtonMode(mode) {
    // mode: "save" | "delete"
    myLineActionBtn.dataset.mode = mode;
    myLineActionBtn.textContent = mode === "delete" ? "삭제" : "저장";

    // 저장/삭제 모두 같은 색 유지
    myLineActionBtn.classList.add("pill-btn-primary");
}

    // 처음 로딩 시 저장된 다짐 불러오기
    const saved = getItem(storageKey) || "";
    showMyLine(saved);

    const hasSaved = Boolean(saved.trim());
    applyMyLineStyle(hasSaved);
    setButtonMode(hasSaved ? "delete" : "save");

function saveMyLine() {
    const text = myLineInput.value.trim();

    if (!text) {
        showMyLine("");
        applyMyLineStyle(false);
        setButtonMode("save");
        myLineInput.focus();
        return;
    }

    setItem(storageKey, text);

    applyMyLineStyle(true);
    setButtonMode("delete");
    myLineInput.blur();
}

function clearMyLine() {
    removeItem(storageKey);
    showMyLine("");

    applyMyLineStyle(false);
    setButtonMode("save");
    myLineInput.focus();
}


    // 입력창 클릭 시 편집 모드 스타일 적용
    myLineInput.addEventListener("focus", () => {
        applyMyLineStyle(false);
    });

    // 버튼 클릭: 현재 모드에 따라 저장/삭제
    myLineActionBtn.addEventListener("click", () => {
        const mode = myLineActionBtn.dataset.mode || "save";
        if (mode === "delete") {
            clearMyLine();
            return;
        }
        saveMyLine();
    });

    // Enter 키: 저장
    myLineInput.addEventListener("keydown", (e) => {
        // 한글 조합 중이면 Enter 저장 금지
        if (e.isComposing) return;

        if (e.key === "Enter") {
            e.preventDefault();
            saveMyLine();
        }
    });
}

async function initDailyQuote() {
    const today = todayKey();

    // 날짜를 키에 포함 (하루 1번 고정)
    const storageKey = `${LS_KEYS.DAILY_QUOTE}:${today}`;

    const savedRaw = getItem(storageKey);

    if (savedRaw) {
        try {
            const savedQuote = JSON.parse(savedRaw);
            showDailyQuote(savedQuote);
            return;
        } catch (error) {
            removeItem(storageKey);
        }
    }

    // 새 명언 가져오기
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
initTheme(); 
bindThemeToggle(); 

initGreeting();
initNickIcon(); 
initNickname(); 

showTodayDate(); 
bindNicknameEdit(); 
initMyLine();

initDailyQuote();
