import React, { useEffect, useState } from "react";
import { SunMoon as SunMoonIcon} from "lucide-react"
import Theme from "./Theme";
import "../../assets/styles/sidebar.css"

interface SideBarProps {
  extraClasses?: string;
}

const Sidebar: React.FC<SideBarProps> = () => {
  const [thisTheme, setThisTheme] = useState(false);
  const [isCursorOnSidebar, setIsCursorOnSidebar] = useState(false);
  const [triggerAnimation, setTriggerAnimation] = useState(false);
  useEffect(() => {
    const sideBarScroll = () => {
      document.body.style.overflow = isCursorOnSidebar ? "hidden" : "unset";
    };
    sideBarScroll()

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCursorOnSidebar]);

  const handleTheme = () => {
    setThisTheme(!thisTheme);
    setTriggerAnimation(false);  // Reset animation
    setTimeout(() => setTriggerAnimation(true), 0);  // Re-trigger animation
  };

  return (<div id="sidebar" 
    key={triggerAnimation ? 'burn-in' : 'reset'}
    className={`fixed top-0 left-0 w-[250px] ${thisTheme
      ? " bg-[var(--sideBar-LightBG)] text-[var(--sideBar-LightText)]"
      : " bg-[var(--sideBar-DarkBG)] text-[var(--sideBar-DarkText)]"
    } p-4 z-[90] h-screen overflow-y-auto pt-10
    transition-transform duration-500 ease-in-out animate-burnIn`}
    onMouseLeave={() => setIsCursorOnSidebar(false)}
    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
    <Theme onClick={handleTheme} />
    <ul className="overflow-y-auto">
      <li>1</li>
      <li>1</li>
      <li>1</li>
      <li>1</li>
      <li>1</li>
      <li>1</li>
      <li>1</li>
      <li>1</li>
      <li>2</li>
      <li>2</li>
      <li>2</li>
      <li>2</li>
      <li>1</li>
      <li>1</li>
      <li>1</li>
      <li>1</li>
      <li>1</li>
      <li>1</li>
      <li>1</li>
      <li>1</li>
      <li>1</li>
      <li>1</li>
      <li>1</li>
      <li>1</li>
      <li>2</li>
      <li>2</li>
      <li>2</li>
      <li>2</li>
      <li>1</li>
      <li>1</li>
      <li>1</li>
      <li>1</li>
      <li>1</li>
      <li>1</li>
      <li>1</li>
      <li>1</li>
      <li>1</li>
      <li>1</li>
      <li>1</li>
      <li>1</li>
      <li>2</li>
      <li>2</li>
      <li>1</li>
      <li>1</li>
      <li>1</li>
      <li>1</li>
      <li>2</li>
      <li>2</li>
      <li>2</li>
      <li>2</li>
      <li>1</li>
      <li>1</li>
      <li>1</li>
      <li>1</li>
      <li>1</li>
      <li>1</li>
      <li>1</li>
      <li>1</li>
      <li>1</li>
      <li>1</li>
      <li>1</li>
      <li>1</li>
      <li>2</li>
      <li>2</li>
      <li>2</li>
      <li>2</li>
      <li>2</li>
      <li>1</li>
      <li>1</li>
      <li>1</li>
      <li>1</li>
    </ul>
  </div>);
};

export default Sidebar;
