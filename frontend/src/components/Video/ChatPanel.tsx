import React, { useState, useEffect, useRef } from "react";
import Input from "../Layout/Input";

interface ChatMessage {
  chatter_id: string;
  message: string;
  time_sent: string;
}

interface ChatPanelProps {
  streamId: number;
  chatterId?: string; // Optional as user might not be logged in
}

const ChatPanel: React.FC<ChatPanelProps> = ({ streamId, chatterId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const lastReceivedRef = useRef<string>("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Load initial chat history
  useEffect(() => {
    const loadPastChat = async () => {
      try {
        const response = await fetch(`/api/chat/${streamId}`);
        if (!response.ok) throw new Error("Failed to fetch chat history");
        const data = await response.json();
        if (data.chat_history) {
          setMessages(data.chat_history);
          if (data.chat_history.length > 0) {
            lastReceivedRef.current =
              data.chat_history[data.chat_history.length - 1].time_sent;
          }
        }
      } catch (error) {
        console.error("Error loading chat history:", error);
      }
    };

    loadPastChat();
  }, [streamId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current)
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
  }, [messages]);

  // Poll for new messages
  useEffect(() => {
    const getRecentChats = async () => {
      if (!lastReceivedRef.current) return;

      try {
        const response = await fetch(
          `/api/load_new_chat/${streamId}?last_received=${lastReceivedRef.current}`
        );
        if (!response.ok) throw new Error("Failed to fetch recent chats");
        const newMessages = await response.json();
        if (newMessages && newMessages.length > 0) {
          setMessages((prev) => [...prev, ...newMessages]);
          lastReceivedRef.current =
            newMessages[newMessages.length - 1].time_sent;
        }
      } catch (error) {
        console.error("Error fetching recent chats:", error);
      }
    };

    const pollInterval = setInterval(getRecentChats, 3000); // Poll every 3 seconds
    return () => clearInterval(pollInterval);
  }, [streamId]);

  const sendChat = async () => {
    if (!inputMessage.trim() || !chatterId) return;

    try {
      const response = await fetch("/api/send_chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatter_id: chatterId,
          stream_id: streamId,
          message: inputMessage,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.chat_sent) {
          setInputMessage("");
        }
      }
    } catch (error) {
      console.error("Error sending chat:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendChat();
    }
  };

  return (
    <div id="chat-panel" className="h-full flex flex-col rounded-lg p-4" >
      <h2 className="text-xl font-bold mb-4 text-white">Stream Chat</h2>

      <div
        ref={chatContainerRef}
        id="chat-message-list"
        className="flex-grow w-full max-h-[50vh] overflow-y-auto mb-4 space-y-2"
      >
        {messages.map((msg, index) => (
          <div key={index} className="grid grid-cols-[8%_minmax(15%,_100px)_1fr] items-center bg-gray-700 rounded p-2 text-white">
            <span className="text-gray-400 text-sm">
              {new Date(msg.time_sent).toLocaleTimeString()}
            </span>
            <span className={`font-bold ${msg.chatter_id === chatterId ? "text-blue-400" : "text-green-400"}`}> {msg.chatter_id}: </span>
            <span>{msg.message}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2">
        <Input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={chatterId ? "Type a message..." : "Login to chat"}
          disabled={!chatterId}
          extraClasses="flex-grow disabled:cursor-not-allowed"
        />
        <button
          onClick={sendChat}
          disabled={!chatterId}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPanel;
