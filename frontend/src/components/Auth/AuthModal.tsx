import React, { useState } from "react";
import { ToggleButton } from "../Layout/Button";
import { LogIn as LogInIcon, User as UserIcon, CircleHelp as ForgotIcon} from "lucide-react";
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
    
    const formMap: { [key: string]: JSX.Element} = {
      Login: <LoginForm onSubmit={(handleSubmit)} onForgotPassword={() => setSelectedTab("Forgot")}/>,
      Register: <RegisterForm onSubmit={(handleSubmit)}/>,
      Forgot: <ForgotPasswordForm onSubmit={(handleSubmit)}/>
    };
    return formMap[selectedTab] || <div>Please select a valid option</div>;
    {/*
    if (selectedTab === "Login") {
      return  <LoginForm onSubmit={(handleSubmit)}/>
    } else if (selectedTab === "Register") {
      return  <RegisterForm onSubmit={(handleSubmit)}/>
    } else if (selectedTab === "Forgot") {
      return  <ForgotPasswordForm onSubmit={(handleSubmit)}/>
    } else
      return <div> Please select a valid icon</div>
      */}

  }

  return (
    <>
      {/*Background Blur*/}
      <div
        id="blurring-layer"
        className="fixed z-50 inset-0 w-screen h-screen backdrop-blur-sm group-has-[input:focus]:backdrop-blur-[5px]"
      ></div>

      {/*Container*/}
      <div id="auth-modal"
        className="fixed inset-0 flex flex-col items-center justify-around z-[9000] 
        h-[95vh] m-auto min-w-[65vw] w-fit py-[80px] rounded-[5rem]  transition-all animate-floating "
      >
        {/* Login/Register Buttons Container */}
        <div className="absolute top-[60px] left-1/2 transform -translate-x-1/2 w-[300px] flex justify-center gap-8 transition-transform overflow-visible ">
          {/* Login Toggle */}
          <ToggleButton
            toggled={selectedTab === "Login"}
            extraClasses="flex flex-col items-center px-8 duration-250 transition-transform hover:translate-y-[-50px] z-[9001]"
            onClick={() => setSelectedTab("Login")}
          >
            <LogInIcon className="h-[40px] w-[40px] mr-1" />
            Login
          </ToggleButton>

          {/* Register Toggle */}
          <ToggleButton
            toggled={selectedTab === "Register"}
            extraClasses="flex flex-col items-center px-8 duration-250 transition-transform hover:translate-y-[-50px] z-[9001]"
            onClick={() => setSelectedTab("Register")}
          >
            <UserIcon className="h-[40px] w-[40px] mr-1" />
            Register
          </ToggleButton>


        </div>
        
        <div
          className="container fixed inset-0 flex flex-col items-center justify-around z-[9999] 
        h-auto max-h-[75vh] m-auto min-w-[31vw] w-fit py-[50px] rounded-[5rem]"
          style={{ "--spin-duration": spinDuration } as React.CSSProperties}
        >
          {/*Border Container*/}
          <div
            id="border-container"
            className="front-content fixed ml-[1px] mt-[0.5px] inset-0 bg-authForm flex flex-col justify-center
          z-50 h-[70vh] min-w-[30vw] w-fit py-[50px] rounded-[2rem] transition-all"
          >
            <div
              id="login-methods"
              className=" w-full flex flex-row items-center justify-evenly"
            >
              <button
                onClick={onClose}
                className="absolute top-[1rem] right-[2rem] text-[2rem] text-white hover:text-red-500 font-black hover:text-[2.5rem] transition-all"
              >
                ✕
              </button>
            </div>
            <>
            {authSwitch()}
            </>
            

          
    
          </div>
        </div>
      </div>

      
    </>
  );
};

export default AuthModal;
