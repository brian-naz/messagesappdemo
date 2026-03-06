import { useState, useEffect } from "react";
import MessageList from "./components/MessageList";
import ChatScreen from "./components/ChatScreen";
import Compose from "./components/Compose";
import { generateResponse } from "./engine/keywordEngine";

function App() {
  const [screen, setScreen] = useState("list");
  const [activeChat, setActiveChat] = useState(null);
  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem("messages-conversations");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem(
      "messages-conversations",
      JSON.stringify(conversations),
    );
  }, [conversations]);

  useEffect(() => {
    const applyTheme = (theme) => {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    const stored = localStorage.getItem("brianos-theme");
    if (stored) {
      applyTheme(stored);
    }

    if (!localStorage.getItem("brianos-theme")) {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      applyTheme(prefersDark ? "dark" : "light");
    }

    const handler = (e) => {
      applyTheme(e.detail);
    };

    window.addEventListener("brianos-theme-change", handler);

    return () => window.removeEventListener("brianos-theme-change", handler);
  }, []);

  return (
    <>
      {screen === "list" && (
        <MessageList
          conversations={conversations}
          setConversations={setConversations}
          onOpen={(name) => {
            setActiveChat(name.trim().toLowerCase());
            setScreen("chat");
          }}
          onCompose={() => setScreen("compose")}
        />
      )}

      {screen === "chat" && activeChat && (
        <ChatScreen
          chatName={activeChat}
          conversations={conversations}
          setConversations={setConversations}
          onBack={() => setScreen("list")}
        />
      )}

      {screen === "compose" && (
        <Compose
          onBack={() => setScreen("list")}
          onCreate={(name, firstMessage) => {
            const normalized = name.trim().toLowerCase();

            const userMessage = {
              id: crypto.randomUUID(),
              text: firstMessage,
              sender: "me",
              timestamp: Date.now(),
              read: true,
            };

            setConversations((prev) => {
              const existing = {
                ...prev,
                [normalized]: [...(prev[normalized] || []), userMessage],
              };

              return existing;
            });

            setActiveChat(normalized);
            setScreen("chat");

            setTimeout(() => {
              const botMessage = {
                id: crypto.randomUUID(),
                text: generateResponse(firstMessage),
                sender: "bot",
                timestamp: Date.now(),
              };

              setConversations((prev) => ({
                ...prev,
                [normalized]: [...(prev[normalized] || []), botMessage],
              }));
            }, 1000);
          }}
        />
      )}
    </>
  );
}

export default App;
