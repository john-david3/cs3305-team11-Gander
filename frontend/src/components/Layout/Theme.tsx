import React, { useState } from 'react';
import { SunMoon as SunMoonIcon, Sun as SunIcon,
        Moon as MoonIcon } from 'lucide-react';

interface ThemeProps {
  children?: React.ReactNode;
  onClick: () => void;
  isMode: boolean;
}

const Theme: React.FC<ThemeProps> = ({ onClick, isMode }) => {

  return (
    <div className='relative top-[0.20em] left-[10em]'>
    <button
      onClick={onClick}
      className= {`p-2 text-[1.5rem] flex items-center gap-2 rounded-md border border-3
        ${isMode ? 
          `text-white bg-[#3478ef] hover:text-[#3478ef] hover:bg-[#000000]
          border-[#3478ef] hover:border-[##3478ef]` :
        `text-yellow-400 bg-white hover:text-yellow-400 hover:bg-white 
          border-yellow-400 hover:border-yellow-400`}
         hover:border-b-4 hover:border-l-4 active:border-b-2 active:border-l-2 transition-all `}
    >
      {isMode ?  <MoonIcon size={27} className={`transition-transform duration-300 ease-in-out`}/>: 
       <SunIcon size={27} className={`transition-transform duration-300 ease-in-out`}/> 
       }

    </button>
    </div>
  );
};

export default Theme;
