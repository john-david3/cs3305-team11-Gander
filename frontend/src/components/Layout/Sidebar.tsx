import React, { useEffect, useState } from "react";
import { SunMoon as SunMoonIcon } from "lucide-react"
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
  const testStreamer: Record<string, string> = {
    "Markiplier": "Slink1",
    "Jacksepticeye": "Slink2",
    "8-BitRyan": "Slink3",
  };

  const testCategory: Record<string, {dummyLink: string; dummyImage: string} > = {
    "Action": {dummyLink : "link1", dummyImage: "../../../images/icons/Action.webp"},
    "Horror": {dummyLink : "link2", dummyImage: "../../../images/icons/Horror.png"},
    "Psychological": {dummyLink : "link3", dummyImage: "../../../images/icons/Psychological.png"},
    "Adult": {dummyLink : "link4", dummyImage: "../../../images/icons/R-18.png"},
    "Shooter": {dummyLink : "link5", dummyImage: "../../../images/icons/Shooter.png"}
  };

  const shownStreamers = Object.entries(testStreamer).map(([dummyCategory, dummyLink]) => {
    return (
      <li key={dummyCategory}>
        <a href={dummyLink}>{dummyCategory}</a>
      </li>
    );
  });

  const shownCategory = Object.entries(testCategory).map(([dummyCategory, {dummyLink, dummyImage}]) => {
    return (
      <li key={dummyCategory} className="flex items-center border border-7 border-black space-x-3 rounded-md p-0 text-center
      hover:bg-[#800020] hover:scale-110 hover:shadow-[-1px_1.5px_10px_white] transition-all duration-250">
        <img src={dummyImage} alt={dummyCategory} className="w-[2em] h-[2em] bg-white ml-[0.25em]"/>
        <a href={dummyLink} className="pr-[7.5em] pt-[0.75em] pb-[0.75em]">{dummyCategory}</a>
      </li>
    );
  });

  return (
    <>
      <div id="sidebar"
        key={triggerAnimation ? 'burn-in' : 'reset'}
        className={`fixed top-0 left-0 w-[250px] ${thisTheme
          ? " bg-[var(--sideBar-LightBG)] text-[var(--sideBar-LightText)]"
          : " bg-[var(--sideBar-DarkBG)] text-[var(--sideBar-DarkText)]"
          } p-4 z-[90] h-screen overflow-y-auto 
    transition-transform duration-500 ease-in-out animate-burnIn`}
        onMouseLeave={() => setIsCursorOnSidebar(false)}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <Theme onClick={handleTheme} />

        <h1 className="style"> Followed </h1>
        <ul>
          {shownStreamers}
        </ul>

        <h1 className="category-style pt-[0.50em]"> Your Categories </h1>
        <ul>
          {shownCategory}
        </ul>

      </div>
    </>
  );
};

export default Sidebar;
