export default function GoogleLogin() {
  const handleLoginClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const nextUrl = encodeURIComponent(window.location.href);
    window.location.href = `/api/login/google?next=${nextUrl}`;
  };

  return (
    <div className="mt-4 w-full hover:scale-105 transition-all ease-in">
      <div className="flex flex-wrap justify-center w-full">
        <button
          onClick={handleLoginClick}
          //w-full basis-[90%] (% size of original container)
          className="flex w-full max-w-[19em] basis-[90%] flex-grow flex-shrink items-center justify-start bg-white text-gray-600 
        font-semibold py-[0.15em] pl-[0.3em] pr-[0.6em] rounded shadow-md flex-grow flex-shrink
        hover:bg-gray-100 active:bg-gray-200 sm:max-w-[18em] mx-[1em]"
        >
          <img
            src="../../../images/icons/google-icon.png"
            alt="Google logo"
            className="w-[2em] h-[2em] mr-2"
          />
          <span className="flex-grow text-[calc((1.5vw+1.5vh)/2)]">
            Sign in with Google
          </span>
        </button>
      </div>
    </div>
  );
}
