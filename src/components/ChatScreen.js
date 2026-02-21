import { useState, useRef } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import TimeSeparator from "./TimeSepatator";
import { generateResponse } from "../engine/keywordEngine";

function ChatScreen({ chatName, conversations, setConversations, onBack }) {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [lastDeliveredId, setLastDeliveredId] = useState(null);

  const bottomRef = useRef(null);

  const messages = conversations[chatName] || [];

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      id: crypto.randomUUID(),
      text: input,
      sender: "me",
      timestamp: Date.now(),
      read: false,
    };

    setConversations((prev) => ({
      ...prev,
      [chatName]: [...(prev[chatName] || []), userMessage],
    }));

    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setLastDeliveredId(null);
      setConversations((prev) => ({
        ...prev,
        [chatName]: prev[chatName].map((m) =>
          m.id === userMessage.id ? { ...m, read: true } : m,
        ),
      }));
    }, 1500);

    setTimeout(
      () => {
        setLastDeliveredId(userMessage.id);
      },
      2000 + Math.random() * 3000,
    );

    setTimeout(() => {
      const botMessage = {
        id: crypto.randomUUID(),
        text: generateResponse(input),
        sender: "bot",
        timestamp: Date.now(),
      };

      setConversations((prev) => ({
        ...prev,
        [chatName]: [...(prev[chatName] || []), botMessage],
      }));

      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen relative">

      <div className="sticky top-0 z-10 relative backdrop-blur-2xl bg-white/30 dark:bg-white/5 border-b border-white/20 dark:border-white/10 p-4 flex items-center justify-center shadow-sm relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent opacity-30 pointer-events-none rounded-b-2xl" />

        <button
          onClick={onBack}
          className="absolute left-4 text-blue-500 dark:text-blue-400 font-medium"
        >
          ←
        </button>
        <div className="flex flex-col items-center">
          <img
            src={`https://ui-avatars.com/api/?name=${chatName}&background=random`}
            className="w-10 h-10 rounded-full mb-1"
            alt="{chatname}"
          />
          <div className="font-semibold text-zinc-900 dark:text-white text-sm">
            {chatName}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 b-24 pb-28">
        {messages.map((msg, index) => {
          const prevMessage = messages[index - 1];

          const showTimeSeparator =
            index === 0 ||
            (prevMessage &&
              msg.timestamp - prevMessage.timestamp >= 60 * 60 * 1000);

          return (
            <div key={msg.id}>
              {showTimeSeparator && <TimeSeparator timestamp={msg.timestamp} />}

              <MessageBubble
                message={msg}
                messages={messages}
                index={index}
                lastDeliveredId={lastDeliveredId}
                onReact={(emoji) => {
                  setConversations((prev) => ({
                    ...prev,
                    [chatName]: prev[chatName].map((m) =>
                      m.id === msg.id
                        ? {
                            ...m,
                            reaction: m.reaction === emoji ? null : emoji,
                          }
                        : m,
                    ),
                  }));
                }}
              />
            </div>
          );
        })}
        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      <div className="fixed bottom-0 left-0 right-0 px-4 pb-4">
        <div
          className="
    flex items-center gap-2 px-4 py-3
    rounded-3xl
    backdrop-blur-3xl
    bg-gradient-to-br from-white/50 to-white/20
    dark:from-white/10 dark:to-white/5
    border border-white/30 dark:border-white/10
    shadow-[0_8px_40px_rgba(0,0,0,0.25)]
  "
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Message"
            className="
        flex-1
        bg-transparent
        outline-none
        text-sm
        text-zinc-900 dark:text-white
        placeholder-zinc-500 dark:placeholder-zinc-400
      "
          />
          <button
            onClick={handleSend}
            className="
        w-9 h-9
        flex items-center justify-center
        rounded-full
        bg-blue-500
        text-white
        shadow-lg
        active:scale-95
        transition
      "
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatScreen;
