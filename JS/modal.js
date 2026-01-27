import { getItem, setItem, LS_KEYS } from "./store.js";
import { cleanNickname, showNickname } from "./render.js";

export function bindNicknameEdit() {
    // 요소 찾기 + 방어
    const nicknameElement = document.querySelector("#nicknameText");
    if (!nicknameElement) return;

    // 편집 시작
    function startEdit() {
        nicknameElement.setAttribute("contenteditable", "true");
        nicknameElement.classList.add("is-editing");
        nicknameElement.focus();

        const range = document.createRange();
        range.selectNodeContents(nicknameElement);

        const selection = window.getSelection();
        if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    // 편집 종료 (저장/취소)
    function finishEdit(save) {
        nicknameElement.removeAttribute("contenteditable");
        nicknameElement.classList.remove("is-editing");

        if (!save) {
            const saved = cleanNickname(getItem(LS_KEYS.NICKNAME));
            showNickname(saved);
            return;
        }

        const edited = cleanNickname(nicknameElement.textContent);
        setItem(LS_KEYS.NICKNAME, edited);
        showNickname(edited);
    }

    // 클릭 → 편집 시작
    nicknameElement.addEventListener("click", () => {
        const isEditing = nicknameElement.getAttribute("contenteditable") === "true";
        if (!isEditing) startEdit();
    });

    //Enter 저장 / Escape 취소
    nicknameElement.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            finishEdit(true);
        }

        if (e.key === "Escape") {
            e.preventDefault();
            finishEdit(false);
        }
    });

    // blur → 저장
    nicknameElement.addEventListener("blur", () => {
        const isEditing = nicknameElement.getAttribute("contenteditable") === "true";
        if (isEditing) finishEdit(true);
    });
}



