import { useState, useRef } from "react";

function MessageList({ conversations, setConversations, onOpen, onCompose }) {
  const [search, setSearch] = useState("");

  const [offset, setOffset] = useState(0);
  const startX = useRef(null);
  const activeRow = useRef(null);

  const formatListTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const days = diff / (1000 * 60 * 60 * 24);

    if (days < 1) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    if (days < 2) return "Yesterday";
    if (days < 7) return date.toLocaleDateString([], { weekday: "short" });

    return date.toLocaleDateString([], {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });
  };

  const handlePointerDown = (e, name) => {
    startX.current = e.clientX;
    activeRow.current = name;
  };

  const handlePointerMove = (e) => {
    if (startX.current === null) return;

    const diff = e.clientX - startX.current;

    if (diff < 0) {
      setOffset(Math.max(diff, -120));
    }
  };

  const handlePointerUp = () => {
    if (startX.current === null) return;

    if (offset < -80 && activeRow.current) {
      const chat = activeRow.current;

      setConversations((prev) => {
        const updated = { ...prev };
        delete updated[chat];
        return updated;
      });
    }

    setOffset(0);
    startX.current = null;
    activeRow.current = null;
  };

  const sortedConversations = Object.keys(conversations)
    .filter((name) => name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const lastA = conversations[a]?.[conversations[a].length - 1];
      const lastB = conversations[b]?.[conversations[b].length - 1];

      const timeA = lastA?.timestamp || 0;
      const timeB = lastB?.timestamp || 0;

      return timeB - timeA;
    });

  return (
    <div className="screen">
      <div className="messages-header">Messages</div>

      <div className="content">
        {sortedConversations.map((name) => {
          const messages = conversations[name] || [];
          const lastMessage = messages[messages.length - 1];

          return (
            <div key={name} className="swipe-container">
              <div className="delete-background">Delete</div>

              <div
                className="swipe-content glass rounded-xl"
                style={{
                  transform:
                    activeRow.current === name
                      ? `translateX(${offset}px)`
                      : "translateX(0)",
                  padding: 12,
                  marginBottom: 12,
                  cursor: "pointer",
                }}
                onPointerDown={(e) => handlePointerDown(e, name)}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onClick={() => onOpen(name)}
              >
                <div className="row">
                  <div
                    className="rounded-full"
                    style={{
                      width: 48,
                      height: 48,
                      background: "var(--accent)",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 600,
                      marginRight: 12,
                    }}
                  >
                    {name.charAt(0).toUpperCase()}
                  </div>

                  <div className="spacer">
                    <div style={{ fontWeight: 600 }}>{name}</div>
                    <div style={{ color: "var(--text-secondary)" }}>
                      {lastMessage?.text || "No messages yet"}
                    </div>
                  </div>

                  {lastMessage && (
                    <div
                      style={{ color: "var(--text-secondary)", fontSize: 12 }}
                    >
                      {formatListTimestamp(lastMessage.timestamp)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bottom-fixed row">
        <div
          className="glass rounded-full"
          style={{
            flex: 1,
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            marginRight: 12,
          }}
        >
          🔍
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            style={{
              border: "none",
              background: "transparent",
              marginLeft: 8,
              flex: 1,
              outline: "none",
              color: "var(--text-primary)",
            }}
          />
        </div>

        <button
          onClick={onCompose}
          className="glass rounded-full"
          style={{
            width: 48,
            height: 48,
            border: "1px solid rgba(69, 69, 69, 0.6)",
            cursor: "pointer",
          }}
        >
          ✏️
        </button>
      </div>
    </div>
  );
}

export default MessageList;
