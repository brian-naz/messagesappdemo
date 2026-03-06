import { useState, useEffect, useRef, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import TimeSeparator from "./TimeSepatator";
import { generateResponse } from "../engine/keywordEngine";

function ChatScreen({ chatName, onBack, conversations, setConversations }) {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  const messages = useMemo(() => {
    return conversations[chatName] || [];
  }, [conversations, chatName]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      id: crypto.randomUUID(),
      text: input,
      sender: "me",
      timestamp: Date.now(),
    };

    setConversations((prev) => ({
      ...prev,
      [chatName]: [...(prev[chatName] || []), userMessage],
    }));

    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(userMessage.text);

      const botMessage = {
        id: crypto.randomUUID(),
        sender: "bot",
        timestamp: Date.now(),
        type: response.type,
        text: response.text || null,
        src: response.src || null,
      };

      setConversations((prev) => ({
        ...prev,
        [chatName]: [...(prev[chatName] || []), botMessage],
      }));

      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="screen">
      <div className="top-fade" />
      <div className="chat-top">
        <button onClick={onBack} className="back-button">
          ‹
        </button>

        <div className="chat-identity">
          <div className="chat-avatar">{chatName.charAt(0).toUpperCase()}</div>

          <div className="contact-pill">{chatName}</div>
        </div>
      </div>

      <div className="chat-content">
        <AnimatePresence initial={false}>
          {messages.map((msg, index) => {
            const prev = messages[index - 1];

            const showSeparator =
              !prev ||
              Math.abs(msg.timestamp - prev.timestamp) >= 60 * 60 * 1000;

            return (
              <div key={msg.id}>
                {showSeparator && <TimeSeparator timestamp={msg.timestamp} />}

                <MessageBubble
                  message={msg}
                  messages={messages}
                  index={index}
                  onReact={(emoji) => {
                    setConversations((prevConvos) => ({
                      ...prevConvos,
                      [chatName]: prevConvos[chatName].map((m) =>
                        m.id === msg.id ? { ...m, reaction: emoji } : m,
                      ),
                    }));
                  }}
                />
              </div>
            );
          })}
        </AnimatePresence>

        {isTyping && <TypingIndicator />}

        <div ref={bottomRef} />
      </div>

      <div className="bottom-fixed">
        <div className="glass rounded-full message-input-bar">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Message"
            className="message-input"
          />

          <button onClick={handleSend} className="send-button">
            ↑
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatScreen;
