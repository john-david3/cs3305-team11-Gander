import { useEffect } from "react";

export function fetchContentOnScroll(callback: () => void, hasMoreData: boolean) {
  useEffect(() => {
    const handleScroll = () => {
      if (!hasMoreData) return; // Don't trigger scroll if no more data
      const scrollPosition = window.innerHeight + document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;

      if (scrollPosition >= scrollHeight * 0.9) {
        callback(); // Trigger data fetching when 90% scroll is reached
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll); // Cleanup on unmount
    };
  }, [callback, hasMoreData]);
}