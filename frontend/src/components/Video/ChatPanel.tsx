import React, { useState, useEffect, useRef } from "react";
import Input from "../Input/Input";
import Button from "../Input/Button";
import AuthModal from "../Auth/AuthModal";
import { useAuthModal } from "../../hooks/useAuthModal";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import { useNavigate } from "react-router-dom";

interface ChatMessage {
  chatter_username: string;
  message: string;
  time_sent: string;
}

interface ChatPanelProps {
  streamId: number;
  onViewerCountChange?: (count: number) => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({
  streamId,
  onViewerCountChange,
}) => {
  const { isLoggedIn, username, userId} = useAuth();
  const { showAuthModal, setShowAuthModal } = useAuthModal();
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Join chat room when component mounts
  useEffect(() => {
    if (socket && isConnected) {
      // Add username check
      socket.emit("join", {
        userId: userId ? userId : null,
        username: username ? username : "Guest",
        stream_id: streamId,
      });

      // Handle beforeunload event
      const handleBeforeUnload = () => {
        socket.emit("leave", {         
          userId: userId ? userId : null,
          username: username ? username : "Guest",
          stream_id: streamId, });
        socket.disconnect();
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      // Load initial chat history
      fetch(`/api/chat/${streamId}`)
        .then((response) => {
          if (!response.ok) throw new Error("Failed to fetch chat history");
          return response.json();
        })
        .then((data) => {
          if (data.chat_history) {
            setMessages(data.chat_history);
          }
        })
        .catch((error) => {
          console.error("Error loading chat history:", error);
        });

      // Handle incoming messages
      socket.on("new_message", (data: ChatMessage) => {
        setMessages((prev) => [...prev, data]);
      });

      // Handle live viewership
      socket.on("status", (data: any) => {
        if (onViewerCountChange && data.num_viewers) {
          onViewerCountChange(data.num_viewers);
        }
      });

      // Cleanup function
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        socket.emit("leave", { stream_id: streamId });
        socket.disconnect();
      };
    }
  }, [socket, isConnected, userId, username, streamId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendChat = () => {
    if (!inputMessage.trim() || !socket || !isConnected) {
      console.log("Invalid message or socket not connected");
      return;
    }

    socket.emit("send_message", {
      username: username,
      stream_id: streamId,
      message: inputMessage.trim(),
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
    <div
      id="chat-panel"
      className="max-w-[30vw] max-h-[83vh] flex flex-col rounded-lg p-[2vh] justify-between"
      style={{ gridArea: "1 / 2 / 3 / 3" }}
    >
      {/* Chat Header */}
      <h2 className="text-xl font-bold mb-4 text-white text-center flex-none">
        Stream Chat
      </h2>

      {/* Message List */}
      <div
        ref={chatContainerRef}
        id="chat-message-list"
        className="w-full h-full overflow-y-auto mb-4 space-y-2 rounded-md"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className="flex items-start space-x-2 bg-gray-800 rounded p-2 text-white"
          >
            {/* User avatar with image */}
            <div
              className={`w-2em h-2em rounded-full overflow-hidden flex-shrink-0 ${
                msg.chatter_username === username ? "" : "cursor-pointer"
              }`}
              onClick={() =>
                msg.chatter_username === username
                  ? null
                  : navigate(`/user/${msg.chatter_username}`)
              }
            >
              <img
                src="/images/monkey.png"
                alt="User Avatar"
                className="w-full h-full object-cover"
                style={{ width: "2.5em", height: "2.5em" }}
              />
            </div>

            <div className="flex-grow overflow-hidden">
              <div className="flex items-center space-x-0.5em">
                {/* Username */}
                <span
                  className={`font-bold text-[1em] ${
                    msg.chatter_username === username
                      ? "text-purple-600"
                      : "text-green-400 cursor-pointer"
                  }`}
                  onClick={() =>
                    msg.chatter_username === username
                      ? null
                      : navigate(`/user/${msg.chatter_username}`)
                  }
                >
                  {msg.chatter_username}
                </span>
              </div>
              {/* Message content */}
              <div className="w-full text-[0.9em] mt-0.5em flex flex-col overflow-hidden">
                {msg.message}
              </div>
            </div>

            {/* Time sent */}
            <div className="text-gray-500 text-[0.8em] self-start">
              {new Date(msg.time_sent).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="flex-none flex justify-center gap-2">
        {isLoggedIn ? (
          <>
            <Input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              extraClasses="flex-grow w-full focus:w-full"
              maxLength={200}
              onClick={() => !isLoggedIn && setShowAuthModal(true)}
            />

            <button
              onClick={sendChat}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Send
            </button>
          </>
        ) : (
          <Button
            extraClasses="text-[1rem] flex items-center flex-nowrap"
            onClick={() => setShowAuthModal(true)}
          >
            Login to Chat
          </Button>
        )}
      </div>
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
};

export default ChatPanel;
