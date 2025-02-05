import React from 'react'

interface ThemeProps {
    children? : React.ReactNode;
    onClick : () => void;
}

const Theme: React.FC<ThemeProps> = ( {onClick, children} ) => {
  return (
    <button 
    onClick={onClick}
    className={` p-2 text-[1.5rem] text-white hover:text-purple-600 bg-black/30 hover:bg-black/80 rounded-md border border-gray-300 hover:border-purple-500 hover:border-b-4 hover:border-l-4 active:border-b-2 active:border-l-2 transition-all`}>
        Light/Dark
    </button>
  )
}

export default Theme
