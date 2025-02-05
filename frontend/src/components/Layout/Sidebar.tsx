import React, { useEffect, useState } from "react";
import Theme from "./Theme";
import "../../assets/styles/sidebar.css"

interface SideBarProps {
  extraClasses?: string;
  scrollActiveSideBar: boolean;
}

const Sidebar: React.FC<SideBarProps> = ( {scrollActiveSideBar}) => {
  const [thisTheme, setThisTheme] = useState(false);
  const [isCursorOnSidebar, setIsCursorOnSidebar] = useState(false);

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
  }

  return <div id="sidebar"   className={`fixed top-0 left-0 w-[250px] ${
    thisTheme
      ? "bg-[var(--sideBar-LightBG)] text-[var(--sideBar-LightText)]"
      : "bg-[var(--sideBar-DarkBG)] text-[var(--sideBar-DarkText)]"
  } p-4 z-[90] h-screen overflow-y-auto scrollbar-hide`}
          onMouseLeave={() => setIsCursorOnSidebar(false)}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <Theme onClick={handleTheme}/>
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
  </div>;
};

export default Sidebar;
