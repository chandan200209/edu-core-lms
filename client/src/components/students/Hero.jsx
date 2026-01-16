import React from "react";
import { assets } from "../../assets/assets";
import SearchBar from "./SearchBar";

const Hero = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full pt-20 md:pt-36 md:px-0 px-7 space-y-7 bg-gradient-to-b from-cyan-100/70">
      <h1 className="font-bold md:text-[48px] text-[28px] text-gray-800 max-w-3xl mx-auto relative">
        Empower your future with the courses designed to{" "}
        <span className="text-blue-600">fit your choice.</span>
        <img
          className="hidden md:block absolute -bottom-7 right-0 "
          src={assets.sketch}
          alt="sketch"
        />
      </h1>
      <p className="mx-auto max-w-2xl hidden md:block text-gray-500">
        We bring together world-class instructors, interactive content, and a
        supportive community you to achieve your personal and professional
        goals.
      </p>
      <p className="mx-auto mx-w-sm block md:hidden text-gray-500">
        We bring together world-class instructors to achieve your professional
        goals.
      </p>
      <SearchBar />
    </div>
  );
};

export default Hero;
