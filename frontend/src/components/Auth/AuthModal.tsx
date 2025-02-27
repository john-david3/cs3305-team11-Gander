import React, { useState } from "react";
import { ToggleButton } from "../Input/Button";
import { LogInIcon, UserIcon } from "lucide-react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import "../../assets/styles/auth.css";

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [selectedTab, setSelectedTab] = useState<string>("Login");
  const [spinDuration, setSpinDuration] = useState("7s");

  const handleSubmit = () => {
    setSpinDuration("1s");
    setTimeout(() => {
      setSpinDuration("7s");
    }, 3500);
  };

  const authSwitch = () => {
    const formMap: { [key: string]: JSX.Element } = {
      Login: (
        <LoginForm
          onSubmit={handleSubmit}
          onForgotPassword={() => setSelectedTab("Forgot")}
        />
      ),
      Register: <RegisterForm onSubmit={handleSubmit} />,
      Forgot: <ForgotPasswordForm onSubmit={handleSubmit} />,
    };
    return formMap[selectedTab] || <div>Please select a valid option</div>;
  };

  return (
    <>
      {/*Background Blur*/}
      <div
        id="blurring-layer"
        className="fixed z-50 inset-0 w-screen h-screen backdrop-blur-sm group-has-[input:focus]:backdrop-blur-[5px]"
      ></div>

      {/*Main Container*/}
      <div
        id="auth-modal"
        className="fixed inset-0 flex items-start justify-center z-[9000] h-[95vh] m-auto pt-[15vh] rounded-[5rem] transition-all animate-floating"
      >
        <div className="relative w-full max-w-[300px] min-w-[28vw]">
          {/* Login/Register Buttons Container */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-20 w-[250px] flex justify-center gap-8 transition-transform overflow-visible">
            {/* Login Toggle */}
            <ToggleButton
              toggled={selectedTab === "Login"}
              extraClasses="flex flex-col items-center px-[1em] sm:px-[1.45em] ml:px-[1.6em] lx:px-[2em]"
              onClick={() => setSelectedTab("Login")}
            >
              <LogInIcon className="w-[2em] sm:w-[2.5em] md:w-[2.75em] lg:w-[3em] mr-1" />
              Login
            </ToggleButton>

            {/* Register Toggle */}
            <ToggleButton
              toggled={selectedTab === "Register"}
              extraClasses="flex flex-col items-center px-[1em] sm:px-[1.45em] ml:px-[1.6em] lx:px-[2em]"
              onClick={() => setSelectedTab("Register")}
            >
              <UserIcon className="w-[2em] sm:w-[2.5em] md:w-[2.75em] lg:w-[3em] mr-1" />
              Register
            </ToggleButton>
          </div>

          {/* Form Container */}
          <div
            className="container flex flex-col items-center justify-around z-[9999] 
            h-[70vh] max-h-[75vh] m-auto py-[50px] rounded-[5rem] transition-all"
            style={{ "--spin-duration": spinDuration } as React.CSSProperties}
          >
            {/*Border Container*/}
            <div
              id="border-container"
              className="front-content ml-[1px] mt-[0.5px] bg-authForm flex flex-col justify-center
                z-50 h-full w-full py-[50px] rounded-[5rem] transition-all"
            >
              <button
                onClick={onClose}
                className="absolute top-[1rem] right-[2rem] text-[2rem] text-white hover:text-red-500 font-black hover:text-[2.5rem] transition-all"
              >
                ✕
              </button>
              <div
                id="login-methods"
                className="w-full flex flex-row items-center justify-evenly"
              >
                {authSwitch()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthModal;
