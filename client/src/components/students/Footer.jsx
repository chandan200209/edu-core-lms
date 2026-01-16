import React from "react";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <footer className="bg-gray-900 md:px-36 px-6 mt-10 text-left">
      <div className="flex flex-col md:flex-row items-start md:gap-32 border-b border-white/30 mx-auto gap-10 px-6 md:px-0 py-10">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <img src={assets.logo_dark} className="w-28 h-10" alt="logo" />
          <p className="text-center text-sm md:text-left text-white/80">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text.
          </p>
        </div>
        <div className="flex flex-col gap-5 md:items-start w-full items-center m">
          <h3 className="font-bold text-white">Company</h3>
          <ul className="flex flex-row md:flex-col text-sm text-white/80 gap-2.5">
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <a href="#">About us</a>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
          </ul>
        </div>
        <div className="md:flex hidden flex-col gap-5 items-start w-full">
          <h3 className="font-bold text-white">Subscribe to our newslater</h3>
          <p className="text-center text-sm md:text-left text-white/80">
            The latest news, articles, and resources, sent to your inbox weekly.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              className="bg-gray-800 border border-gray-500/30 text-gray-500 placeholder-gray-500 outline-none
             w-64 h-9 text-sm rounded-md px-2"
            />
            <button className="text-white bg-blue-600 px-4 py-1 cursor-pointer rounded-md">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      <p className="text-center py-4 text-white/60 text-xs md:text-sm">
        Copyright 2024 © Edemy. All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;
