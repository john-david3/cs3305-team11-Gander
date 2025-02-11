import { useEffect } from "react";

export default function GoogleLogin() {
  const handleLoginClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    window.location.href = "/api/login/google";
  };

  return (
    <div>
    <button
        onClick={handleLoginClick}
        className="flex items-center justify-start bg-white text-gray-600 font-semibold py-1 px-2 rounded shadow-md w-[220px] hover:bg-gray-100 active:bg-gray-200">
        <img
        src="../../../images/icons/google-icon.png"
        alt="Google logo"
        className="w-8 h-8 mr-2"
        />
        <span className="flex-grow">Sign in with Google</span>
    </button>
    </div>
  );
}
