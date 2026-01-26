// HTML에서 id="greetingMessage" 요소 찾기
export function showGreeting(text) {
    const greetingElement = document.querySelector("#greetingMessage");
    if(!greetingElement) return;
    greetingElement.textContent = text;
}

// HTML에서 id="nicknameText" 요소 찾기
export function showNickname(name) {
    const nicknameElement = document.querySelector("#nicknameText");
    if(!nicknameElement) return;
    nicknameElement.textContent = name;
}

// HTML에서 class="nickname-icon" 요소 찾기
export function showNickIcon(icon) {
    const nickiconElement = document.querySelector(".nickname-icon");
    if(!nickiconElement) return;
    nickiconElement.textContent = icon;
}

// HTML에서 id="todayDate" 요소 찾기
export function showTodayDate() {
    const todaydateElement = document.querySelector("#todayDate");
    if(!todaydateElement) return;

    const now = new Date();

    const formatted = new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "short"
    }).format(now);

    todaydateElement.textContent = formatted;
}

// 닉네임 작성 조건
export function cleanNickname(nickname) {
    if(!nickname) {
        nickname = "";
    }

    const nicknameText = String(nickname).trim();
    const shortNickname = nicknameText.slice(0, 20);

    if(!shortNickname) {
        return "FlowDash";
    }

    return shortNickname;
}

// 테마 적용 함수
export function applyTheme(theme) {
    if(theme !== "dark" && theme !== "light") return;

    const htmlRoot = document.documentElement;
    htmlRoot.setAttribute("data-theme", theme);

    const isDark = theme === "dark";
    document.body.classList.toggle("dark", isDark);

    const toggleBtn = document.querySelector("#themeToggleBtn");
    if(toggleBtn) {
        toggleBtn.textContent = isDark ? "🌙" : "☀️"; 
    }
}