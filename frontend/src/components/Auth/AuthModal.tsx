import React, { useState } from "react";
import { ToggleButton } from "../Layout/Button";
import { LogIn as LogInIcon, User as UserIcon } from "lucide-react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import "../../assets/styles/auth.css";


interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [selectedTab, setSelectedTab] = useState<string>("Login");
  const [spinDuration, setSpinDuration] = useState("7s")

  const handleSubmit = () => {
    setSpinDuration("1s");

    setTimeout(() => {
      setSpinDuration("7s");
    }, 5000);
  };

  return (
    <>
      {/*Background Blur*/}
      <div id="blurring-layer" className="fixed z-10 inset-0 w-screen h-screen backdrop-blur-sm group-has-[input:focus]:backdrop-blur-[5px]"></div>
      {/*Container*/}
      <div
        className="container fixed inset-0 flex flex-col items-center justify-around z-50 
        h-[75vh] m-auto min-w-[45vw] w-fit py-[50px] rounded-[5rem] transition-all"
        style={{ "--spin-duration": spinDuration } as React.CSSProperties}
      >

        {/*Border Container*/}  
        <div  
          id="border-container"
          className="front-content fixed inset-0 bg-gradient-to-br from-blue-950 via-purple-500 to-violet-800 flex flex-col justify-center
          z-50 h-[70vh] mr-0.5 mb-0.5 m-auto min-w-[40vw] w-fit py-[50px] rounded-[2rem] transition-all"
          >
          <div id="login-methods" className=" w-full flex flex-row items-center justify-evenly">
            <button
              onClick={onClose}
              className="absolute top-[1rem] right-[2rem] text-[2rem] text-white hover:text-red-500 font-black hover:text-[2.5rem] transition-all"
            >
              ✕
            </button>
            <ToggleButton
              toggled={selectedTab === "Login"}
              extraClasses="flex flex-col items-center px-8"
              onClick={() => setSelectedTab("Login")}
            >
              <LogInIcon className="h-[40px] w-[40px] mr-1" />
              Login
            </ToggleButton>
            <ToggleButton
              toggled={selectedTab === "Register"}
              extraClasses="flex flex-col items-center px-8"
              onClick={() => setSelectedTab("Register")}
            >
              <UserIcon className="h-[40px] w-[40px] mr-1" />
              Register
            </ToggleButton>
          </div>
          {selectedTab === "Login" ? <LoginForm /> : <RegisterForm onSubmit={handleSubmit}/>}
        </div>
      </div>
    </>
  );
};

export default AuthModal;
