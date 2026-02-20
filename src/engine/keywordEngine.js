const keywordMap = {
  hello: ["Hey 👋", "Hi there!", "Hello!"],
  bye: ["Talk soon!", "See you 👋", "Bye!"],
  help: ["How can I help you?", "What do you need?"],
  default: ["Interesting...", "Tell me more.", "Hmm 👀"],
};

export function generateResponse(text) {
  const lower = text.toLowerCase();

  for (const key in keywordMap) {
    if (lower.includes(key)) {
      const responses = keywordMap[key];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }

  const fallback = keywordMap.default;
  return fallback[Math.floor(Math.random() * fallback.length)];
}
