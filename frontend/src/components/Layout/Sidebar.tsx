import React, { useEffect, useState } from "react";
import { SunMoon as SunMoonIcon } from "lucide-react"
import Theme from "./Theme";
import "../../assets/styles/sidebar.css"

interface SideBarProps {
  extraClasses?: string;
}

const Sidebar: React.FC<SideBarProps> = () => {
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


  const testStreamer: Record<string, string> = {
    "Markiplier": "Slink1",
    "Jacksepticeye": "Slink2",
    "8-BitRyan": "Slink3",
  };

  const testCategory: Record<string, { dummyLink: string; dummyImage: string }> = {
    "Action": { dummyLink: "link1", dummyImage: "../../../images/icons/Action.webp" },
    "Horror": { dummyLink: "link2", dummyImage: "../../../images/icons/Horror.png" },
    "Psychological": { dummyLink: "link3", dummyImage: "../../../images/icons/Psychological.png" },
    "Adult": { dummyLink: "link4", dummyImage: "../../../images/icons/R-18.png" },
    "Shooter": { dummyLink: "link5", dummyImage: "../../../images/icons/Shooter.png" }
  };

  const shownStreamers = Object.entries(testStreamer).map(([dummyCategory, dummyLink]) => {
    return (
      <li key={dummyCategory}>
        <a href={dummyLink}>{dummyCategory}</a>
      </li>
    );
  });

  const shownCategory = Object.entries(testCategory).map(([dummyCategory, { dummyLink, dummyImage }]) => {
    return (
      <li key={dummyCategory} className="flex items-center border border-7 border-black space-x-3 rounded-md p-0 text-center
      hover:bg-[#800020] hover:shadow-[-1px_1.5px_10px_white] transition-all duration-250 m-[0.25em]">
        <img src={dummyImage} alt={dummyCategory} className="w-[2em] h-[2em] bg-white ml-[0.25em]" />
        <a href={dummyLink} className="pr-[7.5em] pt-[0.75em] pb-[0.75em]">{dummyCategory}</a>
      </li>
    );
  });

  return (
    <>

      <div className="overflow-hidden">
        <h1 className="style"> Followed </h1>
        <ul>
          {shownStreamers}
        </ul>

        <h1 className="category-style pt-[0.50em] overflow-hidden"> Your Categories </h1>
        <ul>
          {shownCategory}
        </ul>

      </div>
    </>
  );
};

export default Sidebar;
