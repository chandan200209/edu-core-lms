import React from "react";
import { assets } from "../../assets/assets";

const CallToAction = () => {
  return (
    <div className="flex flex-col items-center gap-4 pt-10 pb-24 md:px-0 px-6">
      <h1 className="font-semibold text-xl md:text-3xl text-gray-800">
        Learn anything, anytime, anywhere
      </h1>
      <p className="md:text-base w-2/3 text-gray-800">
        Incididunt sint fugiat pariatur cupidatat consectetur sit cillum anim id
        veniam aliqua proident excepteur commodo do ea.
      </p>
      <div className="flex gap-6 mt-6 items-center">
        <button className="text-white bg-blue-600 text-base rounded-md px-8 py-3 cursor-pointer">
          Get Started
        </button>
        <button className="flex items-center gap-2 cursor-pointer">
          <span>Learn more</span>{" "}
          <img className="h-4 w-4" src={assets.arrow_icon} alt="" />
        </button>
      </div>
    </div>
  );
};

export default CallToAction;
