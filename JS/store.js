export const LS_KEYS = {
	NICKNAME: "flowdash-nickname",
	THEME: "flowdash-theme",
	MYLINE: "flowdash-myline",
	DAILY_QUOTE: "flowdash-daily-quote",
	TODO: "flowdash-todos",
};

export function setItem(key, value) {
	localStorage.setItem(key, value);
}

export function getItem(key) {
	return localStorage.getItem(key);
}

export function removeItem(key) {
	localStorage.removeItem(key);
}

export function todayKey() {
	const now = new Date();

	const year = String(now.getFullYear());
	const month = String(now.getMonth() + 1).padStart(2, "0");
	const day = String(now.getDate()).padStart(2, "0");

	return `${year}-${month}-${day}`;
}
