import React, { useContext } from "react";
import CourseCard from "./CourseCard";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

const CoursesSection = () => {
  const { allCourses } = useContext(AppContext);
  return (
    <div className="flex flex-col gap-4 py-16 w-full px-8 md:px-40 items-center">
      <h2 className="text-3xl font-medium text-gray-800">
        Learn from the best
      </h2>
      <p className="text-gray-500 text-center w-7/12 text-sm md:text-base">
        Discover our top-rated courses across various categories. From coding
        and design to wellness and business , our courses are crafted to deliver
        results.
      </p>
      <div className="grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-4 px-0 md:px-4 my-12 ">
        {allCourses.slice(0, 4).map((course, index) => (
          <CourseCard key={index} course={course} />
        ))}
      </div>
      <div>
        <Link
          to="/course-list"
          onClick={() => scrollTo(0, 0)}
          className="text-gray-500 border border-gray-500/30 rounded px-10 py-3"
        >
          Show all courses
        </Link>
      </div>
    </div>
  );
};

export default CoursesSection;
