import React, { useContext, useEffect } from "react";
import Navbar from "../../components/students/Navbar";
import { AppContext } from "../../context/AppContext";
import { useState } from "react";
import Loading from "../../components/students/Loading";
import axios from "axios";
import { toast } from "react-toastify";

const MyCourses = () => {
  const { currency, backendUrl, allCourses, getToken, isEducator } = useContext(AppContext);
  const [courses, setCourses] = useState(null);
  const fetchEducatorCourses = async () => {
    setCourses(allCourses);
  };
  // const fetchEducatorCourses = async () => {
  //   try {
  //     const token = await getToken();
  //     const { data } = await axios.get(backendUrl + '/api/educator/courses', {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     })
  //     data.success && setCourses(data.courses);
  //   } catch (error) {
  //     toast.error(error.message);
  //   }
  // };
  useEffect(() => {
    fetchEducatorCourses();
  }, []);
  // useEffect(() => {
  //   if (isEducator) {
  //     fetchEducatorCourses();
  //   }
  // }, [isEducator]);
  return courses ? (
    <div className="flex flex-col items-start justify-between h-screen pb-0 md:pb-0 p-4 md:p-8 pt-8">
      <div className="w-full">
        <h2 className="pb-4 text-lg font-medium">My Courses</h2>
        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <table className="md:table-auto w-full overflow-hidden table-fixed">
            <thead className="text-gray-900 border-b border-gray-500/20 text-left text-sm">
              <tr>
                <th className="px-4 py-3 font-semibold truncate">
                  All Courses
                </th>
                <th className="px-4 py-3 font-semibold truncate">Earnings</th>
                <th className="px-4 py-3 font-semibold truncate">Students</th>
                <th className="px-4 py-3 font-semibold truncate">
                  Published on
                </th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {courses.map((course) => (
                <tr className="border-b border-gray-500/20" key={course._id}>
                  <td className="pl-2 md:pl-4 truncate md:px-4 py-3 flex items-center space-x-3">
                    <img
                      src={course.courseThumbnail}
                      className="w-16 "
                      alt="Course Image"
                    />
                    <span className="truncate hidden md:block">
                      {course.courseTitle}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {currency}{" "}
                    {Math.floor(
                      course.enrolledStudents.length *
                      (course.coursePrice -
                        (course.discount * course.coursePrice) / 100)
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {course.enrolledStudents.length}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(course.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default MyCourses;
