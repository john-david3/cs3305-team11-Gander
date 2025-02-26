import { useState } from "react";
import { Mail, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
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
    <footer className="bg-gradient-to-r from-[#1a1a2e] to-[#3a0ca3] text-white p-10">
      <div className="flex flex-wrap justify-between gap-x-10 gap-y-6">
        {/* About Section */}
        <div className="flex-1 min-w-[250px]">
          <h2 className="text-2xl font-bold">Gander</h2>
          <p className="text-sm mt-2">Your very favourite streaming service</p>
        </div>

        {/* Office Section */}
        <div className="flex-1 min-w-[200px]">
          <h3 className="text-lg font-semibold mb-2">Some Street</h3>
          <p className="text-sm">On Some Road</p>
          <p className="text-sm">Near Some Country</p>
          <p className="text-sm">That is definitely on Earth</p>
          <p className="text-sm mt-2">
            <a href="mailto:xyzemail@gmail.com" className="underline">info@gander.com</a>
          </p>
          <p className="text-sm">+69-280690345</p>
        </div>

        {/* Links Section */}
        <div className="flex-1 min-w-[150px]">
          <h3 className="text-lg font-semibold mb-2">Links</h3>
          <ul className="space-y-1">
            <li><a href="#" className="hover:underline">Home</a></li>
            <li><a href="#" className="hover:underline">Categories</a></li>
            <li><a href="#" className="hover:underline">Live Now</a></li>
            <li><a href="#" className="hover:underline">User Page</a></li>
            <li><a href="#" className="hover:underline">Contact</a></li>
          </ul>
        </div>

        {/* Newsletter Section */}
        <div className="flex-1 min-w-[250px]">
          <h3 className="text-lg font-semibold mb-2">Newsletter</h3>
          <div className="flex items-center border-b border-white py-2">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-transparent outline-none text-sm flex-1 px-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Mail className="text-white cursor-pointer" onClick={() => handleKeyDown({ key: "Enter" })} />
          </div>

          {/* Social Icons */}
          <div className="flex gap-4 mt-4">
            <Facebook className="cursor-pointer hover:opacity-80" />
            <Twitter className="cursor-pointer hover:opacity-80" />
            <Instagram className="cursor-pointer hover:opacity-80" />
            <Linkedin className="cursor-pointer hover:opacity-80" />
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center text-xs border-t border-gray-600 mt-6 pt-4">
        Group 11
      </div>
    </footer>
  );
};

export default Footer;
