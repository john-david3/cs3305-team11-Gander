import React, { useState, useEffect, useRef } from "react";
import Input from "../Layout/Input";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import Button, { ToggleButton } from "../Layout/Button";
import AuthModal from "../Auth/AuthModal";

interface ChatMessage {
  chatter_username: string;
  message: string;
  time_sent: string;
}

interface ChatPanelProps {
  streamId: number;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ streamId }) => {
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { isLoggedIn, username } = useAuth();

  // Join chat room when component mounts
  useEffect(() => {
    if (socket && isConnected) {
      // Add username check
      socket.emit("join", {
        username: username ? username : "Guest",
        stream_id: streamId,
      });

      // Handle beforeunload event
      const handleBeforeUnload = () => {
        socket.emit("leave", { stream_id: streamId });
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
        console.log("New message:", data);
        setMessages((prev) => [...prev, data]);
      });

      // Cleanup function
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        socket.emit("leave", { stream_id: streamId });
        socket.disconnect();
      };
    }
  }, [socket, isConnected, username, streamId]);

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

  //added to show login/reg if not
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (showAuthModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showAuthModal]);

  return (
    <>
      <div id="chat-panel" className="h-full flex flex-col rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4 text-white">Stream Chat</h2>

        <div
          ref={chatContainerRef}
          id="chat-message-list"
          className="flex-grow w-full max-h-[50vh] overflow-y-auto mb-4 space-y-2"
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className="grid grid-cols-[minmax(15%,_100px)_1fr] group h-fit items-center bg-gray-700 rounded p-2 text-white"
            >
              <span
                className={`font-bold ${msg.chatter_username === username
                    ? "text-blue-400"
                    : "text-green-400"
                  }`}
              >
                {" "}
                {msg.chatter_username}:{" "}
              </span>
              <span className="text-center" >{msg.message}</span>
              <span className="text-gray-400 text-sm scale-0 group-hover:scale-100 h-[0px] group-hover:h-[10px] transition-all delay-1000 group-hover:delay-200">
                {new Date(msg.time_sent).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-2">
          {isLoggedIn ? (
            <>
              <Input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={
                  isLoggedIn ? "Type a message..." : "Login to chat"
                }
                disabled={!isLoggedIn}
                extraClasses="flex-grow"
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
              extraClasses="text-[1rem] flex items-center flex-nowrap z-[999]"
              onClick={() => setShowAuthModal(true)}
            >
              Login to Chat
            </Button>
          )}
        </div>
        {showAuthModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            <AuthModal onClose={() => setShowAuthModal(false)} />
          </div>
        )}
      </div>
    </>
  );
};

export default ChatPanel;
