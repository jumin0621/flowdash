console.log("main.js 실행됨");

// 다른 js 파일에서 불러오기
import { LS_KEYS, getItem, setItem } from "./store.js";

import {
    showGreeting,
    showNickname,
    showNickIcon,
    showTodayDate,
    cleanNickname,
    applyTheme
} from "./render.js";

import {
    pickRandom,
    greetingList,
    nickIconList
} from "./api.js";

import { bindNicknameEdit } from "./modal.js";


// 최초 테마 결정
function initTheme() {
    const saved = getItem(LS_KEYS.THEME);

    if(saved === "dark" || saved === "light") {
        applyTheme(saved);
        return;
    }

const prefersDark =
    window.matchMedia("(prefers-color-scheme: dark)").matches;

    const initial = prefersDark ? "dark" : "light";

    setItem(LS_KEYS.THEME, initial);
    applyTheme(initial);
}

// 버튼 클릭 시 테마 전환
function bindThemeToggle() {
    const toggleBtn = document.querySelector("#themeToggleBtn");
    if(!toggleBtn) return;

    toggleBtn.addEventListener("click", () => {
        const currentTheme = 
            document.documentElement.getAttribute("data-theme");

        const nextTheme = 
            currentTheme === "dark" ? "light" : "dark";

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

    if(saved) {
        showNickname(saved);
        return;
    }

    const nicknameElement = document.querySelector("#nicknameText");
    const raw = nicknameElement ? nicknameElement.textContent : "";
    const initial = cleanNickname(raw);

    setItem(LS_KEYS.NICKNAME, initial);
    showNickname(initial);
}

// [실행부] 앱 시작 시 동작

initTheme();          // 테마 먼저
bindThemeToggle();   // 테마 버튼 연결

initGreeting();      // 인사말
initNickIcon();      // 아이콘
initNickname();      // 닉네임

showTodayDate();     // 날짜 표시
bindNicknameEdit(); // 닉네임 수정 기능
