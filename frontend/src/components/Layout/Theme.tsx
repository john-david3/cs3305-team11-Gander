import React from 'react';
import { SunMoon as SunMoonIcon } from 'lucide-react';

interface ThemeProps {
  children?: React.ReactNode;
  onClick: () => void;
}

const Theme: React.FC<ThemeProps> = ({ onClick }) => {
  return (
    <div className='relative top-[0.20em] left-[10em]'>
    <button
      onClick={onClick}
      className="p-2 text-[1.5rem] flex items-center gap-2 text-white hover:text-purple-600 bg-black/30 hover:bg-black/80 rounded-md border border-gray-300 hover:border-purple-500 hover:border-b-4 hover:border-l-4 active:border-b-2 active:border-l-2 transition-all"
    >
      <SunMoonIcon size={27}
        className={`transition-transform duration-300 ease-in-out`}
      />
    </button>
    </div>
  );
};

export default Theme;
