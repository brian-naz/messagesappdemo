import { useState, useEffect } from "react";
import { motion } from "framer-motion";

function MessageBubble({ message, messages, index, onReact, lastDeliveredId }) {
  const isMe = message.sender === "me";
  const [showReactions, setShowReactions] = useState(false);
  const isLast =
    !messages[index + 1] || messages[index + 1].sender !== message.sender;

  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  useEffect(() => {
    const handleClick = () => setShowReactions(false);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <div
      className={`flex ${isMe ? "justify-end" : "justify-start"} relative`}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowReactions(!showReactions);
      }}
    >
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="max-w-[70%]"
      >
        <div
          className={`
          px-4 py-2 rounded-2xl text-sm shadow-xl backdrop-blur-xl border
          ${
            isMe
              ? `bg-blue-500 text-white ${isLast ? "rounded-br-md" : ""}`
              : `bg-white/60 dark:bg-zinc-800 text-black dark:text-white border-white/40 dark:border-zinc-700 ${
                  isLast ? "rounded-bl-md" : ""
                }`
          }
        `}
        >
          {message.text}
        </div>

        <div
          className={`text-[10px] mt-1 text-zinc-600 dark:text-zinc-400 text-right${
            isMe ? "text-right" : "text-left"
          }`}
        >
          {time}
        </div>

        {isMe && message.id === lastDeliveredId && (
          <div className="text-[10px] text-zinc-500 dark:text-zinc-400 text-right">
            Delivered
          </div>
        )}
      </motion.div>

      {showReactions && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute -top-10 left-4 px-3 py-2 rounded-full bg-white/80 dark:bg-zinc-800 backdrop-blur-xl shadow-xl flex gap-2"
        >
          {["❤️", "👍", "😂", "😮", "😢"].map((e) => (
            <span
              key={e}
              onClick={() => {
                onReact(e);
                setShowReactions(false);
              }}
              className="cursor-pointer hover:scale-125 transition"
            >
              {e}
            </span>
          ))}
        </motion.div>
      )}
      {message.reaction && (
        <div className="mt-1 text-sm">{message.reaction}</div>
      )}
    </div>
  );
}

export default MessageBubble;
