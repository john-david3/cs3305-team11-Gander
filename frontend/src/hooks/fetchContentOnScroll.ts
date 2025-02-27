import { useEffect } from "react";

export function fetchContentOnScroll(callback: () => void, hasMoreData: boolean) {
  useEffect(() => {
    const root = document.querySelector("#root") as HTMLElement;
    
    const handleScroll = () => {
      if (!hasMoreData) return; // Don't trigger scroll if no more data
      
      // Use properties of the element itself, not document
      const scrollPosition = root.scrollTop + root.clientHeight;
      const scrollHeight = root.scrollHeight;

      if (scrollPosition >= scrollHeight * 0.9) {
        callback(); // Trigger data fetching when 90% scroll is reached
        setTimeout(() => {
          // Delay to prevent multiple fetches
          root.scrollTop = root.scrollTop - 1;
        }, 100);
      }
    };

    // Add scroll event listener to the root element
    root.addEventListener("scroll", handleScroll);

    return () => {
      root.removeEventListener("scroll", handleScroll); // Cleanup on unmount
    };
  }, [callback, hasMoreData]);
}