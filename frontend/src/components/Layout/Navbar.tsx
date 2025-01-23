import React from "react";
import Logo from "./Logo";
import Button from "./Button";
import { Link } from "react-router-dom";
import { Search, User, LogIn } from "lucide-react";

interface NavbarProps {
  logged_in: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ logged_in }) => {
  return (
    <div className="flex flex-col justify-around items-center h-[45vh]">
      <Logo />
      <div className="nav-buttons flex items-center space-x-4">
        {logged_in ? (
          <div>
            <Link
              to="/logout"
              className="flex items-center text-gray-700 hover:text-purple-600"
            >
              <Button title="" />
            </Link>
          </div>
        ) : (
          <div>
            <Link
              to="/login"
              className="flex items-center text-gray-700 hover:text-purple-600"
            >
              <LogIn className="h-5 w-5 mr-1" />
              Login
            </Link>
            <Link
              to="/signup"
              className="flex items-center text-gray-700 hover:text-purple-600"
            >
              <User className="h-5 w-5 mr-1" />
              Sign Up
            </Link>
          </div>
        )}
        <Button title="Quick Settings" />
      </div>

      <div className="search-bar relative">
        <input
          type="text"
          placeholder="Search..."
          className="w-64 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-purple-500"
        />
        <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>
    </div>
  );
};

export default Navbar;
