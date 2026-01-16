import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { AppContext } from "../../context/AppContext";

const Navbar = () => {
  const { openSignIn } = useClerk();
  const { navigate, isEducator } = useContext(AppContext);
  const { user } = useUser();
  const isCourseListPage = location.pathname.includes("course-list");
  return (
    <div
      className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b py-4 border-gray-400 ${
        isCourseListPage ? "bg-white" : "bg-cyan-100/70"
      }`}
    >
      <img
        src={assets.logo}
        alt="Logo"
        className="w-28 lg:w-32 cursor-pointer"
        onClick={() => navigate("/")}
      />
      <div className="hidden md:flex gap-5 items-center text-gray-500">
        <div className="flex items-center gap-4">
          {user && (
            <>
              <button
                onClick={() => navigate("/educator")}
                className="cursor-pointer"
              >
                {isEducator ? "Educator Dashboard" : "Become Educator"}
              </button>{" "}
              |<Link to="/my-enrollments"> My Enrollments</Link>
            </>
          )}
        </div>
        {user ? (
          <UserButton />
        ) : (
          <button
            onClick={() => {
              openSignIn();
            }}
            className="bg-blue-600 px-5 py-2 text-white rounded-full cursor-pointer"
          >
            Create Account
          </button>
        )}
      </div>
      <div className="md:hidden flex items-center text-[10px] gap-2 sm:gap-4 sm:text-sm md:text-md text-gray-500">
        <div className="">
          {user && (
            <>
              <button
                onClick={() => navigate("/educator")}
                className="cursor-pointer"
              >
                {isEducator ? "Educator Dashboard" : "Become Educator"}
              </button>{" "}
              |<Link to="/my-enrollments"> My Enrollments</Link>
            </>
          )}
        </div>
        {user ? (
          <UserButton />
        ) : (
          <button
            onClick={() => {
              openSignIn();
            }}
          >
            <img
              className="cursor-pointer"
              src={assets.user_icon}
              alt="user_icon"
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
