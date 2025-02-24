import React from "react";
import Navbar from "../Navigation/Navbar";
import { useSidebar } from "../../context/SidebarContext";

interface DynamicPageContentProps extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
  navbarVariant?: "home" | "no-navbar" | "default";
  className?: string;
  contentClassName?: string;
  style?: React.CSSProperties;
}

const DynamicPageContent: React.FC<DynamicPageContentProps> = ({
  children,
  navbarVariant = "default",
  className = "",
  contentClassName = "",
  style,
}) => {
  const { showSideBar } = useSidebar();

  return (
    <div className={className} style={style}>
      {navbarVariant !== "no-navbar" && <Navbar variant={navbarVariant} />}
      <div
        id="content"
        className={`min-w-[850px] ${
          showSideBar ? "w-[85vw] translate-x-[15vw]" : "w-[100vw]"
        } items-start transition-all duration-[500ms] ease-in-out ${contentClassName}`}
      >
        {children}
      </div>
    </div>
  );
};

export default DynamicPageContent;
