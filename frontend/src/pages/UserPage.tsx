import React from "react";

interface UserPageProps {
  username: string;
}

const UserPage: React.FC<UserPageProps> = ({ username }) => {
  return (
    <div className="bg-[#808080] h-screen w-screen flex flex-col items-center justify-center">
      <h1>{username}</h1>
      <p>Profile page for {username}</p>
    </div>
  );
};

export default UserPage;
