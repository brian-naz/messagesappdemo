import egg from "../assets/egg.png";

const keywordMap = {
  hello: [
    "Hey 👋",
    "Hi there!",
    "Hello!",
    "Hey, what's up?",
    "Hi! How are you?",
  ],

  hi: ["Hey!", "Hi 👋", "Hello there!"],

  bye: ["Talk soon!", "See you 👋", "Bye!", "Catch you later."],

  thanks: ["You're welcome!", "No problem 🙂", "Anytime!", "Happy to help!"],

  thank: ["You're welcome!", "Glad I could help!"],

  help: ["How can I help you?", "What do you need?", "Sure — what’s going on?"],

  how: ["That's a good question.", "What do you think?", "Hmm, tell me more."],

  why: [
    "That's an interesting question.",
    "I'm not sure, but I'd like to hear your thoughts.",
  ],

  what: ["Good question.", "What do you think it is?"],

  where: ["Somewhere interesting, hopefully.", "That's a mystery."],

  when: ["Soon maybe!", "Hard to say."],

  yes: ["Nice 👍", "Sounds good.", "Alright!"],

  no: ["Fair enough.", "Got it.", "Okay."],

  love: ["❤️", "That's sweet.", "Love that."],

  haha: ["😂", "Glad you found that funny.", "Haha!"],

  lol: ["😂", "Haha"],

  sad: ["Sorry to hear that.", "That sounds tough.", "Hope things get better."],

  angry: ["That sounds frustrating.", "I get why you'd feel that way."],

  good: ["Nice!", "Glad to hear it."],

  bad: ["That's unfortunate.", "Hope it improves."],

  egg: [{ type: "image", src: egg }],

  markiplier: [{ type: "image", src: egg }],

  default: [
    "Interesting...",
    "Tell me more.",
    "Hmm 👀",
    "I see.",
    "Go on...",
    "Really?",
    "That's cool.",
  ],
};

export function generateResponse(text) {
  const lower = text.toLowerCase();

  for (const key in keywordMap) {
    if (lower.includes(key)) {
      const responses = keywordMap[key];
      const response = responses[Math.floor(Math.random() * responses.length)];

      if (typeof response === "string") {
        return { type: "text", text: response };
      }

      return response;
    }
  }

  const fallback = keywordMap.default;
  const textResponse = fallback[Math.floor(Math.random() * fallback.length)];

  return { type: "text", text: textResponse };
}
