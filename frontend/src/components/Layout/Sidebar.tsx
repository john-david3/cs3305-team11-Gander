import React from "react";

interface SideBarProps {
  extraClasses?: string;
}

const Sidebar: React.FC<SideBarProps> = ( {extraClasses}) => {
  return <div className={`${extraClasses} " fixed top-0 left-0 z-0 w-[250px] bg-gray-800 text-white p-4 z-[0]"`}></div>;
};

export default Sidebar;
