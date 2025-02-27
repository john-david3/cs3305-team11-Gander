import { Mail as MailIcon } from "lucide-react";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      send_newsletter();
    }
  }

  const send_newsletter = async () => {
    if (email) {
      if (email.trim() === "") return;
      try {
        const response = await fetch(`/api/send_newsletter/${email}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });

        if (!response.ok) {
          throw new Error("Failed to subscribe");
        }

        setEmail("");
        alert("Successfully added to newsletter");

      } catch (error) {
        console.error("Error subscribing:", error);
      }
    }
  };

  return (
    <footer className="absolute bottom-0 h-[12vh] w-full p-4 bg-gradient-to-b from-white/0 via-[#3a0ca3]/50 to-[#3a0ca3] text-white">
      <div className="flex justify-between gap-x-10 gap-y-6 flex-wrap">
        {/* About Section */}
        <div className="flex-[2] min-w-[50px] shrink">
          <h2 className="text-2xl font-bold">Gander</h2>
        </div>

        {/* Newsletter Section */}
        <div className="flex-1 min-w-[100px] shrink">
          <h3 className="text-lg font-semibold mb-2 pl-2">Our Newsletter</h3>
          <div className="flex items-center border-b border-white py-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-transparent outline-none text-sm flex-1 px-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <MailIcon className="text-white cursor-pointer" onClick={send_newsletter} />
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="text-center text-xs border-t border-gray-600 mt-6 pt-4">Group 11</div>
      </div>
    </footer>
  );
};

export default Footer;
