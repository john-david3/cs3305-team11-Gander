import React from "react";
import html2canvas from "html2canvas";

const Screenshot: React.FC = () => {
  const captureScreenshot = async () => {
    const targetElement = document.getElementById("root"); // Capture entire HTML document

    if (!targetElement) {
      console.error("Target element not found");
      return;
    }

    try {
      // Ensure everything is visible before capturing
      document.body.style.overflow = "visible";
      document.documentElement.style.overflow = "visible";

      const canvas = await html2canvas(targetElement, {
        useCORS: true, // Enables external image capture (CORS-safe)
        scale: 2, // Higher resolution screenshot
        backgroundColor: "#fff", // Ensures non-transparent background
        windowWidth: document.documentElement.scrollWidth, // Capture full width
        windowHeight: document.documentElement.scrollHeight, // Capture full height
      });

      // Restore overflow settings
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `screenshot-${Date.now()}.png`;
      link.click();
    } catch (error) {
      console.error("Screenshot capture failed:", error);
    }
  };

  return (
    <button
      onClick={captureScreenshot}
      className="bg-[var(--screenshot-bg)] text-[var(--screenshot-text)] px-4 py-2 
      rounded-md hover:bg-[var(--screenshot-bg-hover)] hover:text-[var(--screenshot-text-hover)] 
      transition ease-in duration-250"
    >
      Capture Full Page Screenshot
    </button>
  );
};

export default Screenshot;
