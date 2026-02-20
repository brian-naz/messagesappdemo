import { useState, useEffect } from "react";
import MessageList from "./components/MessageList";
import ChatScreen from "./components/ChatScreen";
import Compose from "./components/Compose";
import { generateResponse } from "./engine/keywordEngine";

export default function App() {
  const [screen, setScreen] = useState("list");
  const [activeChat, setActiveChat] = useState(null);

  const [conversations, setConversations] = useState(() => {
    return (
      JSON.parse(localStorage.getItem("conversations")) || {
        john: [],
        sarah: [],
      }
    );
  });

  useEffect(() => {
    localStorage.setItem("conversations", JSON.stringify(conversations));
  }, [conversations]);

  return (
    <div className="relative h-screen bg-gradient-to-br from-slate-100 to-white dark:from-black dark:to-zinc-900 text-black dark:text-white">
      {screen === "list" && (
        <MessageList
          conversations={conversations}
          setConversations={setConversations}
          onOpen={(name) => {
            setConversations((prev) => ({
              ...prev,
              [name]: prev[name].map((m) =>
                m.sender === "bot" ? { ...m, read: true } : m,
              ),
            }));

            setActiveChat(name);
            setScreen("chat");
          }}
          onCompose={() => setScreen("compose")}
        />
      )}

      {screen === "chat" && (
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

            setConversations((prev) => ({
              ...prev,
              [normalized]: [...(prev[normalized] || []), userMessage],
            }));

            setActiveChat(normalized);
            setScreen("chat");

            // Trigger bot response
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
    </div>
  );
}
