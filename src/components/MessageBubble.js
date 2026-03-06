import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

function MessageBubble({ message, messages, index, onReact, lastDeliveredId }) {
  const isMe = message.sender === "me";
  const [showReactions, setShowReactions] = useState(false);

  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const bubbleRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (bubbleRef.current && !bubbleRef.current.contains(e.target)) {
        setShowReactions(false);
      }
    };
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [showReactions]);

  return (
    <div
      ref={bubbleRef}
      className={`message-row ${isMe ? "me" : "bot"}`}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowReactions(!showReactions);
      }}
    >
      <motion.div
        className={`message-container ${isMe ? "me" : "bot"}`}
        initial={{ opacity: 0, y: 10, x: isMe ? 20 : -20 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className={`bubble-wrapper ${isMe ? "me" : "bot"}`}>
          {message.reaction && (
            <div className={`reaction-row ${isMe ? "me" : "bot"}`}>
              {message.reaction}
            </div>
          )}
          <div className={`message-bubble ${isMe ? "me" : "bot"}`}>
            {message.type === "image" ? (
              <img src={message.src} alt="bot" className="message-image" />
            ) : (
              message.text
            )}
          </div>

          <div className={`message-time ${isMe ? "me" : "bot"}`}>{time}</div>
        </div>
      </motion.div>

      {showReactions && (
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`reaction-menu ${isMe ? "me" : "bot"}`}
        >
          {["❤️", "👍", "😂", "😮", "😢"].map((emoji) => (
            <span
              key={emoji}
              onClick={() => {
                onReact(message.reaction === emoji ? null : emoji);
                setShowReactions(false);
              }}
            >
              {emoji}
            </span>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default MessageBubble;
