import React from "react";

interface LoadingScreenProps {
  children?: React.ReactNode;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  children = "Loading...",
}) => {
  return (
    <div className="h-screen w-screen flex items-center justify-center text-white">
      {children}
    </div>
  );
};

export default LoadingScreen;
