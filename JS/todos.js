import { updateDashCount } from "./dashboard.js";
import { currentPeriod, filterPeriod } from "./filter.js";
import { currentPriority, filterPriority } from "./filter.js";
import { currentTitle, sortTitle } from "./filter.js";
import { currentKeyword, filterKeyword } from "./filter.js";
import { LS_KEYS } from "./store.js";
import { updateProgress } from "./progress.js";

// =========================
// 화면 값 받아와서 셋팅하기
// =========================
const modalWrap = document.querySelector(".modal-wrap");
const modalTitle = document.getElementById("modalTitle");

const todoForm = document.getElementById("todoForm");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const statusSelect = document.getElementById("status");
const cancelBtn = document.getElementById("cancelBtn");
const closeModalBtn = document.getElementById("closeModal");

const todoBoard = document.querySelector(".todo-card");
const doingBoard = document.querySelector(".progress-card");
const doneBoard = document.querySelector(".done-card");

const searchInput = document.querySelector(".search");
const dateFilter = document.querySelector(".select-filter");
const priorityFilter = document.querySelector(".priority-filter");
const titleSort = document.querySelector(".title-sort");
const filterBadge = document.getElementById("filterBadge");

// =========================
// 초기화
// =========================
let todos = [];
let createId = null;

// =========================
// 데이터 저장하기
// =========================
function saveTodos() {
	localStorage.setItem(LS_KEYS.TODO, JSON.stringify(todos));
}

// =========================
// 데이터 불러오기
// =========================
function loadTodos() {
	const data = localStorage.getItem(LS_KEYS.TODO);
	if (!data) {
		todos = [];
		return;
	}
	todos = JSON.parse(data);
}

// =========================
// 우선순위 셋팅하기
// =========================
function getPriority() {
	const checked = document.querySelector('input[name="priority"]:checked');
	if (!checked) {
		return "mid";
	} else if (checked.id === "high") {
		return "high";
	} else if (checked.id === "low") {
		return "low";
	} else {
		return "mid";
	}
}

function setPriority(priority) {
	const radio = document.getElementById(priority);
	if (radio) radio.checked = true;
}

function priorityText(priority) {
	if (priority === "high") {
		return "높음";
	} else if (priority === "mid") {
		return "중간";
	} else {
		return "낮음";
	}
}

// =========================
// 모달창
// =========================
function openModal(mode) {
	modalWrap.classList.add("is-open");
	modalTitle.textContent = mode === "edit" ? "할일 수정" : "새 할일";
}

function closeModal() {
	modalWrap.classList.remove("is-open");
	todoForm.reset();
	createId = null;
}

const openModalBtn = document.getElementById("openModalBtn");
if (openModalBtn) {
	openModalBtn.addEventListener("click", function () {
		createId = null;
		todoForm.reset();
		statusSelect.value = "todo";
		setPriority("mid");
		openModal("create");
		titleInput.focus();
	});
}

cancelBtn.addEventListener("click", closeModal);
closeModalBtn.addEventListener("click", closeModal);

// =========================
// 날짜 셋팅하기
// =========================
function formDate(timestamp) {
	const now = new Date(timestamp);
	const YYYY = now.getFullYear();
	const MM = String(now.getMonth() + 1).padStart(2, "0");
	const DD = String(now.getDate()).padStart(2, "0");
	const hh = String(now.getHours()).padStart(2, "0");
	const mm = String(now.getMinutes()).padStart(2, "0");
	return `${YYYY}.${MM}.${DD} ${hh}:${mm}`;
}

// =========================
// 카드안쪽 태그 만들기
// =========================
function makeTask(todo) {
	const task = document.createElement("div");
	task.classList.add("box", "task");

	// 할일
	if (todo.priority === "high") {
		task.classList.add("task-high");
	} else if (todo.priority === "low") {
		task.classList.add("task-low");
	} else {
		task.classList.add("task-mid");
	}

	// 진행중
	if (todo.status === "doing" && todo.priority === "high") {
		task.classList.add("high-color");
	} else if (todo.status === "doing" && todo.priority === "mid") {
		task.classList.add("mid-color");
	} else if (todo.status === "doing" && todo.priority === "low") {
		task.classList.add("low-color");
	}

	// 완료
	if (todo.status === "done" && todo.priority === "high") {
		task.classList.add("done-high-color");
	} else if (todo.status === "done" && todo.priority === "mid") {
		task.classList.add("done-mid-color");
	} else if (todo.status === "done" && todo.priority === "low") {
		task.classList.add("done-low-color");
	}

	task.dataset.id = todo.id;

	// 취소선
	const doneLine = todo.status === "done" ? "line-through #e45774" : "none";

	// 업데이트 일때 (완료면 수정일 제외)
	const updatedAtHtml =
		todo.status !== "done" && todo.updatedAt
			? `<p>수정일 ${formDate(todo.updatedAt)}</p>`
			: "";

	// 완료 일때
	const completedAtHtml = todo.completedAt
		? `<p>완료일 ${formDate(todo.completedAt)}</p>`
		: "";

	// 화면에 보여줄 일자
	const dateHtml = `
	<p>등록일 ${formDate(todo.createdAt)}</p>
	${updatedAtHtml}
  ${completedAtHtml}`;

	// 태그 생성
	task.innerHTML = `
    <div class="task-top">
			<span class="badge badge-${todo.priority}">${priorityText(todo.priority)}</span>
      <button class="close" type="button">×</button>
    </div>

    <p class="task-title" style="text-decoration:${doneLine}; text-decoration-thickness:1px;">
      ${todo.title}
    </p>

    <p class="task-desc" style="text-decoration:${doneLine}; text-decoration-thickness:1px;">
      ${todo.content || ""}
    </p>

    <div class="task-date">
      ${dateHtml}
    </div>
  `;

	return task;
}

// =========================
// 렌더링
// =========================
export function render() {
	// 기존 task 싹 지우기
	todoBoard.querySelectorAll(".task").forEach((el) => el.remove());
	doingBoard.querySelectorAll(".task").forEach((el) => el.remove());
	doneBoard.querySelectorAll(".task").forEach((el) => el.remove());

	// 기간 필터 적용 화면 만들기(전체 || 오늘 || 7일)
	const viewTodos = filterPeriod(todos, currentPeriod);
	// 기간 필터 적용 안에서 검색
	const searched = filterKeyword(viewTodos, currentKeyword);
	// 우선 순위 필터 적용하기(전체 || 높은 || 중간 || 낮음)(기간 → 우선순위)
	const filterPri = filterPriority(searched, currentPriority);
	// 제목 오름차순 내림차순 필터
	const sortedTitle = sortTitle(filterPri, currentTitle);

	// 상태별로 나눠서 추가
	const todoList = sortedTitle.filter((t) => t.status === "todo"); //todos에서 viewTodos로 바꿈 viewTodos에서 sortTitle변경
	const doingList = sortedTitle.filter((t) => t.status === "doing"); //todos에서 viewTodos로 바꿈 viewTodos에서 sortTitle변경
	const doneList = searched.filter((t) => t.status === "done"); //todos에서 viewTodos로 바꿈 viewTodos에서 검색 적용되게 searched로 바꿈

	// 데이터 없음 메시지 지우기
	function toggleEmpty(todos, list) {
		const empty = todos.querySelector(".empty-msg");
		if (!empty) return;

		empty.style.display = list.length === 0 ? "block" : "none";
	}

	toggleEmpty(todoBoard, todoList);
	toggleEmpty(doingBoard, doingList);
	toggleEmpty(doneBoard, doneList);

	todoList.forEach((t) => todoBoard.appendChild(makeTask(t)));
	doingList.forEach((t) => doingBoard.appendChild(makeTask(t)));
	doneList.forEach((t) => doneBoard.appendChild(makeTask(t)));

	// count
	todoBoard.querySelector(".count").textContent = todoList.length;
	doingBoard.querySelector(".count").textContent = doingList.length;
	doneBoard.querySelector(".count").textContent = doneList.length;

	updateProgress(todoList.length, doingList.length, doneList.length);

	// =======달성률===========
	const achievement =
		todos.length === 0 || doneList.length === 0
			? "-"
			: Math.round((doneList.length / todos.length) * 100);
	// dashboard 카운트 업데이트
	updateDashCount({
		total: todos.length,
		todo: todoList.length,
		doing: doingList.length,
		done: doneList.length,
		achievement,
	});
}
// =========================
// 조건, 필터 뱃지 활성화
// =========================
function labelDate(e) {
	if (e === "today") return "오늘";
	if (e === "7day") return "7일";
	return "";
}

function labelPriority(e) {
	if (e === "height") return "높음";
	if (e === "middle") return "보통";
	if (e === "low") return "낮음";
	return "";
}

function labelSort(e) {
	if (e === "down-sort") return "제목 내림차순";
	return "";
}

function getActiveBadges() {
	const badges = [];
	const dFilter = dateFilter?.value;
	const dLabel = labelDate(dFilter);
	if (dLabel) badges.push({ key: "date", text: `기간: ${dLabel}` });

	const pFilter = priorityFilter?.value;
	const pLabel = labelPriority(pFilter);
	if (pLabel) badges.push({ key: "priority", text: `우선순위: ${pLabel}` });

	const sFilter = titleSort?.value;
	const sLabel = labelSort(sFilter);
	if (sLabel) badges.push({ key: "sort", text: `정렬: ${sLabel}` });

	return badges;
}

function renderBadges() {
	if (!filterBadge) return;

	const badges = getActiveBadges();
	filterBadge.innerHTML = "";

	filterBadge.style.display = badges.length ? "flex" : "none";
	if (!badges.length) return;

	badges.forEach((i) => {
		const cName = document.createElement("span");
		cName.className = "filter-badges";
		cName.dataset.key = i.key;

		cName.innerHTML = `
      <span>${i.text}</span>
    `;

		filterBadge.appendChild(cName);
	});
}

// =========================
// 할일 추가
// =========================

// ID부여
function getNextId() {
	if (todos.length === 0) return 1;

	let maxId = 0;

	for (let i = 0; i < todos.length; i++) {
		const num = Number(todos[i].id);
		if (num > maxId) maxId = num;
	}
	return maxId + 1;
}

// 폼안쪽내용
function addTodo(title, content, status, priority) {
	const now = Date.now();

	const newTodo = {
		id: String(getNextId()),
		title: title,
		content: content,
		status: status,
		priority: priority,
		createdAt: now,
		updatedAt: null,
		completedAt: status === "done" ? now : null,
	};

	todos.push(newTodo);
	saveTodos();
	render();
}

// =========================
// 할일 수정
// =========================
function updateTodo(id, title, content, status, priority) {
	const now = Date.now();

	const todo = todos.find((t) => t.id === id);
	if (!todo) return;

	todo.title = title;
	todo.content = content;
	todo.priority = priority;
	todo.updatedAt = now;

	if (todo.status !== status) {
		todo.status = status;

		if (status === "done") {
			todo.completedAt = now;
		} else {
			todo.completedAt = null;
		}
	}

	saveTodos();
	render();
}

// =========================
// 할일 하나씩 삭제
// =========================
function deleteTodo(id) {
	if (
		confirm(
			`이 일정을 삭제하시겠습니까? \n` + `삭제된 일정은 복구할 수 없습니다.`,
		)
	) {
		todos = todos.filter((t) => t.id !== id);
		saveTodos();
		render();
	}
}

// =========================
// status 상태별 전체 삭제
// =========================
function deleteAllByStatus(status) {
	let seletTodo = status;

	if (seletTodo === "todo") {
		seletTodo = "'할일'";
	} else if (seletTodo === "doing") {
		seletTodo = "'진행중'";
	} else {
		seletTodo = "'완료'";
	}

	if (
		confirm(
			`선택하신 ${seletTodo} 의 전체 데이터가 삭제됩니다. \n` +
				`각 리스트의 우측 X 버튼으로 개별 삭제할 수 있습니다. \n` +
				`정말 ${seletTodo} 데이터를 삭제 하시겠습니까?`,
		)
	) {
		todos = todos.filter((t) => t.status !== status);
		saveTodos();
		render();
	}
}

// =========================
// 전체 데이터 삭제
// =========================
function resetFilter() {
	if (searchInput) searchInput.value = "";
	if (dateFilter) dateFilter.value = "total";
	if (priorityFilter) priorityFilter.value = "priority";
	if (titleSort) titleSort.value = "up-sort";
	if (filterBadge) filterBadge.innerHTML = "";
}

function resetAll() {
	if (confirm(`정말 삭제하시겠습니까?\n초기화 후엔 되돌릴 수 없습니다.`)) {
		resetFilter(); // 필터걸린거 초기화

		localStorage.removeItem(LS_KEYS.TODO); // 스토리지 초기화

		todos = [];

		render();
	}
}

// =========================
// 수정할때 기존 정보 불러오기
// =========================
function fillForm(todo) {
	titleInput.value = todo.title;
	contentInput.value = todo.content;
	statusSelect.value = todo.status;
	setPriority(todo.priority);
}

// 화면 폼 보내기
todoForm.addEventListener("submit", function (e) {
	e.preventDefault();

	const title = titleInput.value.trim();
	const content = contentInput.value.trim();
	const status = statusSelect.value;
	const priority = getPriority();

	if (!title) return;

	if (createId === null) {
		addTodo(title, content, status, priority);
	} else {
		updateTodo(createId, title, content, status, priority);
	}

	closeModal();
});

// 이벤트 위임
document.querySelector(".board-wrap").addEventListener("click", function (e) {
	const target = e.target;

	// 리스트 우측 X 삭제 버튼
	if (target.classList.contains("close")) {
		const task = target.closest(".task");
		deleteTodo(task.dataset.id);
		return;
	}

	// 리스트 클릭하면 수정 모달 열기
	const task = target.closest(".task");
	if (!task) return;

	const todo = todos.find((t) => t.id === task.dataset.id);
	if (!todo) return;

	createId = todo.id;
	fillForm(todo);
	openModal("edit");
});

// 할일,진행중,완료 상태별 전체 삭제
todoBoard.querySelector(".del-all").addEventListener("click", function () {
	deleteAllByStatus("todo");
});
doingBoard.querySelector(".del-all").addEventListener("click", function () {
	deleteAllByStatus("doing");
});
doneBoard.querySelector(".del-all").addEventListener("click", function () {
	deleteAllByStatus("done");
});

// 전체 데이터 초기화 (스토리지 포함)
document.getElementById("allReset")?.addEventListener("click", resetAll);

// 정렬, 필터 조건 표시
dateFilter?.addEventListener("change", () => {
	renderBadges();
	render();
});
priorityFilter?.addEventListener("change", () => {
	renderBadges();
	render();
});
titleSort?.addEventListener("change", () => {
	renderBadges();
	render();
});

loadTodos();
renderBadges();
render();
closeModal();
