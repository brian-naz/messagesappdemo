import { useState } from "react";

function Compose({ onBack, onCreate }) {
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");

  const canSend = recipient.trim() && message.trim();

  const handleSend = () => {
    if (!canSend) return;
    onCreate(recipient.trim(), message.trim());
  };

  return (
    <div
      className="
      flex flex-col h-screen
      bg-gradient-to-br
      from-slate-100 to-white
      dark:from-black dark:to-zinc-900
      text-black dark:text-white
    "
    >
      <div
        className="
        sticky top-0 z-20
        backdrop-blur-3xl
        bg-white/30 dark:bg-white/5
        border-b border-white/20 dark:border-white/10
        px-4 pt-4 pb-5
        flex items-center justify-center
        relative
      "
      >
        <div className="font-semibold text-sm">New Message</div>

        <button
          onClick={onBack}
          className="
            absolute right-4
            w-8 h-8
            flex items-center justify-center
            rounded-full
            bg-white/20 dark:bg-white/10
          "
        >
          ✕
        </button>
      </div>

      <div className="px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-sm opacity-60">To:</span>
          <input
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Name"
            className="
              flex-1 bg-transparent outline-none text-sm
              text-zinc-900 dark:text-white
              placeholder-zinc-500 dark:placeholder-zinc-400
            "
            autoFocus
          />
        </div>
      </div>

      <div className="flex-1" />

      <div className="fixed bottom-0 left-0 right-0 px-4 pb-4">
        <div
          className="
          flex items-center gap-2
          px-4 py-3
          rounded-3xl
          backdrop-blur-3xl
          bg-gradient-to-br from-white/50 to-white/20
          dark:from-white/10 dark:to-white/5
          border border-white/30 dark:border-white/10
          shadow-[0_8px_40px_rgba(0,0,0,0.25)]
        "
        >
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="iMessage"
            className="
              flex-1 bg-transparent outline-none text-sm
              text-zinc-900 dark:text-white
              placeholder-zinc-500 dark:placeholder-zinc-400
            "
          />

          <button
            onClick={handleSend}
            disabled={!canSend}
            className={`
              w-9 h-9 flex items-center justify-center rounded-full
              text-white transition
              ${
                canSend
                  ? "bg-blue-500 shadow-lg active:scale-95"
                  : "bg-blue-300 opacity-50"
              }
            `}
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  );
}

export default Compose;
