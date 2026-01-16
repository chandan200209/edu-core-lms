import React, { useEffect, useState } from "react";
import Navbar from "../../components/students/Navbar";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import SearchBar from "../../components/students/SearchBar";
import { useParams } from "react-router-dom";
import CourseCard from "../../components/students/CourseCard";
import Footer from "../../components/students/Footer";
import { assets } from "../../assets/assets";

const CoursesList = () => {
  const { navigate, allCourses } = useContext(AppContext);
  const { input } = useParams();
  const [filteredCourses, setFilteredCourses] = useState([]);
  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const tempCourses = allCourses.slice();
      if (allCourses && allCourses.length > 0) {
        input
          ? setFilteredCourses(
              tempCourses.filter((item) =>
                item.courseTitle.toLowerCase().includes(input.toLowerCase())
              )
            )
          : setFilteredCourses(tempCourses);
      }
    }
  }, [allCourses, input]);
  return (
    <>
      <div className="relative px-6 md:px-32 pt-20 text-left">
        <div className="flex md:flex-row flex-col justify-between items-start gap-6 ">
          <div>
            <h1 className="text-xl md:text-4xl text-gray-800 font-semibold">
              Course List
            </h1>
            <p className="text-gray-500">
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => {
                  navigate("/");
                }}
              >
                Home
              </span>{" "}
              / <span>Course List</span>
            </p>
          </div>
          <div className="md:w-[460px]">
            <SearchBar data={input} />
          </div>
        </div>
        {input && (
          <div className="flex items-center shadow shadow-gray-200 gap-2.5 border-2 border-gray-500 mt-6 px-3 py-1 w-fit rounded-2xl text-gray-600">
            <p>{input}</p>
            <img
              src={assets.cross_icon}
              alt="cross_icon"
              className="cursor-pointer"
              onClick={() => {
                navigate("/course-list");
              }}
            />
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-8 mb-24 gap-3 px-2 md:p-0">
          {filteredCourses.map((course, index) => {
            return <CourseCard key={index} course={course} />;
          })}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CoursesList;
