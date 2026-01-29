// 무작위로 값을 뽑게해주는 함수
export function pickRandom(list) {
    const length = list.length;
    const randomNumber = Math.random() * length;
    const index = Math.floor(randomNumber);

    return list[index];
}

// 시간에 따른 인사말 목록
export function greetingList(hour) {
    if (hour >= 5 && hour <= 10) {
        return ["좋은 아침이에요,", "햇살 좋은 아침이에요,", "상쾌한 아침이에요,"];
    }
    if (hour >= 11 && hour <= 16) {
        return ["좋은 오후예요,", "나른한 오후네요,", "오늘도 잘 하고 있어요,"];
    }
    if (hour >= 17 && hour <= 22) {
        return ["좋은 저녁이에요,", "수고 많았어요,", "오늘도 한 걸음 왔네요,"];
    }
    return ["안녕하세요,", "아직 깨어있군요,", "고요한 밤이에요,"];
}

// 아이콘 목록
export function nickIconList() {
    return ["✨", "🌟", "💫", "🪄", "🔥", "🍀", "🧸", "🐰"];
}

// 오늘의 명언 API
export async function fetchQuote() {
    try {
        const res = await fetch("https://korean-advice-open-api.vercel.app/api/advice");

        if (!res.ok) {
            throw new Error("명언 API 응답 실패");
        }

        const data = await res.json();

        return {
            text: `“${data.message}”`,
            meta: "- 오늘의 명언"
        };
    } catch (error) {
        console.error("명언 불러오기 실패:", error);

        // 실패 시 대체 문구
        return {
            text: "“오늘도 충분히 잘하고 있어요.”",
            meta: "- FlowDash"
        };
    }
}
