import React, { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import Input from "../Layout/Input";
import { useAuth } from "../../context/AuthContext";

interface ChatMessage {
  chatter_id: string;
  message: string;
  time_sent: string;
}

interface ChatPanelProps {
  streamId: number;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ streamId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { isLoggedIn, username } = useAuth();

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io("/", {
      path: "/api/socket.io",
      withCredentials: true
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket Connection established!");
      // Join the stream's chat room
      newSocket.emit("join", { stream_id: streamId });
    });

    newSocket.on("new_message", (data: ChatMessage) => {
      setMessages(prev => [...prev, data]);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });
  
    newSocket.on("connect_timeout", () => {
      console.error("Socket connection timeout");
    });

    newSocket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    // Cleanup on unmount
    return () => {
      newSocket.emit("leave", { stream_id: streamId });
      newSocket.close();
    };
  }, [streamId]);

  // Load initial chat history
  useEffect(() => {
    const loadPastChat = async () => {
      try {
        const response = await fetch(`/api/chat/${streamId}`);
        if (!response.ok) throw new Error("Failed to fetch chat history");
        const data = await response.json();
        if (data.chat_history) {
          setMessages(data.chat_history);
        }
      } catch (error) {
        console.error("Error loading chat history:", error);
      }
    };

    loadPastChat();
  }, [streamId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendChat = () => {
    if (!inputMessage.trim() || !socket) {
      console.log("No message to send or socket not initialized!");
      return;
    };

    socket.emit("send_message", {
      stream_id: streamId,
      message: inputMessage.trim()
    });

    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendChat();
    }
  };
  
  return (
    <div id="chat-panel" className="h-full flex flex-col rounded-lg p-4">
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
            <span className={`font-bold ${msg.chatter_id === username ? "text-blue-400" : "text-green-400"}`}> {msg.chatter_id}: </span>
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
          placeholder={isLoggedIn ? "Type a message..." : "Login to chat"}
          disabled={!isLoggedIn}
          extraClasses="flex-grow disabled:cursor-not-allowed"
        />
        <button
          onClick={sendChat}
          disabled={!isLoggedIn}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPanel;