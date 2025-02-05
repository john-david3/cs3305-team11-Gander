import React, { useEffect, useState } from "react";
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

  return <div id="sidebar" className={"fixed top-0 left-0 bg-[var(--sideNav-LightBG)] w-[250px] text-sideBar-text p-4 z-[90] h-screen overflow-y-auto scrollbar-hide"}
          onMouseEnter={() => setIsCursorOnSidebar(true)}
          onMouseLeave={() => setIsCursorOnSidebar(false)}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
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
