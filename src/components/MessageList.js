import { useState, useMemo } from "react";
import GlassHeader from "./GlassHeader";

function MessageList({ conversations, setConversations, onOpen, onCompose }) {
  const [search, setSearch] = useState("");

  const [startX, setStartX] = useState(null);
  const [currentX, setCurrentX] = useState(0);
  const [activeSwipe, setActiveSwipe] = useState(null);
  const sortedConversations = useMemo(() => {
    return Object.keys(conversations)
      .sort((a, b) => {
        const aLast = conversations[a]?.slice(-1)[0]?.timestamp || 0;
        const bLast = conversations[b]?.slice(-1)[0]?.timestamp || 0;
        return bLast - aLast;
      })
      .filter((name) => name.toLowerCase().includes(search.toLowerCase()));
  }, [conversations, search]);

  const handleDelete = (name) => {
    setConversations((prev) => {
      const updated = { ...prev };
      delete updated[name];
      return updated;
    });
  };

  const formatListTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();

    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    const startOfYesterday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 1,
    );

    const diffInDays =
      (startOfToday -
        new Date(date.getFullYear(), date.getMonth(), date.getDate())) /
      (1000 * 60 * 60 * 24);

    if (date >= startOfToday) {
      // Today → show time
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    if (date >= startOfYesterday) {
      return "Yesterday";
    }

    if (diffInDays < 7) {
      return date.toLocaleDateString([], {
        weekday: "short",
      });
    }

    return date.toLocaleDateString([], {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-screen relative">
      <GlassHeader
        center={<div className="text-2xl font-semibold text-sm">Messages</div>}
      />

      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-28">
        {sortedConversations.map((name) => {
          const messages = conversations[name] || [];
          const lastMessage = messages[messages.length - 1];

          return (
            <div key={name} className="relative overflow-hidden">
              {activeSwipe === name && (
                <div
                  className="
    absolute inset-0
    bg-red-500
    flex items-center justify-end
    pr-6
    text-white font-semibold
    rounded-2xl
  "
                >
                  Delete
                </div>
              )}

              <div
                onTouchStart={(e) => {
                  setStartX(e.touches[0].clientX);
                  setActiveSwipe(name);
                }}
                onTouchMove={(e) => {
                  if (activeSwipe !== name) return;

                  const delta = e.touches[0].clientX - startX;

                  if (delta < 0) {
                    setCurrentX(delta);
                  }
                }}
                onTouchEnd={() => {
                  if (currentX < -100) {
                    handleDelete(name);
                  }

                  setActiveSwipe(null);
                  setCurrentX(0);
                }}
                style={{
                  transform:
                    activeSwipe === name
                      ? `translateX(${currentX}px)`
                      : "translateX(0px)",
                  transition:
                    activeSwipe === name ? "none" : "transform 0.2s ease",
                }}
                onClick={() => {
                  // Clear unread
                  setConversations((prev) => ({
                    ...prev,
                    [name]: prev[name].map((m) =>
                      m.sender === "bot" ? { ...m, read: true } : m,
                    ),
                  }));
                  onOpen(name);
                }}
                className="
                  flex items-center gap-4 p-3
                  rounded-2xl
                  backdrop-blur-xl
                  bg-gradient-to-br from-white/40 to-white/10
                  dark:from-white/10 dark:to-white/5
                  border border-white/30 dark:border-white/10
                  shadow-[0_4px_20px_rgba(0,0,0,0.15)]
                  cursor-pointer
                  transition
                "
              >
                <div
                  className="
                  w-12 h-12 rounded-full
                  bg-gradient-to-br from-blue-400 to-purple-500
                  flex items-center justify-center
                  text-white font-semibold
                "
                >
                  {name.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-medium capitalize">{name}</div>
                  <div className="text-sm opacity-60 truncate">
                    {lastMessage?.text || "No messages yet"}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  {lastMessage && (
                    <div className="text-xs opacity-50">
                      {formatListTimestamp(lastMessage.timestamp)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-0 left-0 right-0 px-4 pb-4">
        <div className="flex items-center gap-3">
          <div
            className="
      flex items-center gap-2
      flex-1
      px-4 py-3
      rounded-3xl
      backdrop-blur-3xl
      bg-gradient-to-br from-white/50 to-white/20
      dark:from-white/10 dark:to-white/5
      border border-white/30 dark:border-white/10
      shadow-[0_8px_40px_rgba(0,0,0,0.25)]
    "
          >
            <span className="text-2xl text-zinc-500 text-sm">⌕</span>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="
          flex-1 bg-transparent outline-none text-sm
          text-zinc-900 dark:text-white
          placeholder-zinc-500 dark:placeholder-zinc-400
        "
            />
          </div>

          <button
            onClick={onCompose}
            className="
        w-11 h-11
        flex items-center justify-center
        rounded-full
        backdrop-blur-3xl
        bg-gradient-to-br from-white/50 to-white/20
        dark:from-white/10 dark:to-white/5
        border border-white/30 dark:border-white/10
        shadow-[0_8px_40px_rgba(0,0,0,0.25)]
        active:scale-95
        transition
      "
          >
            ✏️
          </button>
        </div>
      </div>
    </div>
  );
}

export default MessageList;
