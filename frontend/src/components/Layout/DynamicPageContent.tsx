import React from "react";
import Navbar from "../Navigation/Navbar";
import { useSidebar } from "../../context/SidebarContext";

interface DynamicPageContentProps {
  children: React.ReactNode;
  navbarVariant?: "home" | "default";
  className?: string;
  style?: React.CSSProperties;
}

const DynamicPageContent: React.FC<DynamicPageContentProps> = ({ 
  children, 
  navbarVariant = "default",
  className = "",
  style
}) => {
  const { showSideBar } = useSidebar();

  return (
    <div className={className} style={style}>
      <Navbar variant={navbarVariant} />
      <div id="content" className={`${showSideBar ? "w-[85vw] translate-x-[15vw]" : "w-[100vw]"} transition-all duration-[500ms] ease-in-out`}>
        {children}
      </div>
    </div>
  );
};

export default DynamicPageContent;