import React, { useState } from "react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ data }) => {
  const navigate = useNavigate();
  const [input, setInput] = useState(data ? data : "");
  const onSubmitHandler = (e) => {
    e.preventDefault();
    navigate("/course-list/" + input);
  };
  return (
    <form
      onSubmit={onSubmitHandler}
      className="max-w-xl w-full flex items-center md:h-14 h-12 border border-gray-500/50 rounded bg-white"
    >
      <img
        src={assets.search_icon}
        alt="search_icon"
        className="px-3 md:w-auto w-10"
      />
      <input
        type="text"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
        }}
        placeholder="Search for courses "
        className="text-gray-500/80 w-full h-full outline-none"
      />
      <button
        type="submit"
        className="bg-blue-600 md:px-10 px-7 py-2 mx-1 rounded-md text-white font-light cursor-pointer"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
