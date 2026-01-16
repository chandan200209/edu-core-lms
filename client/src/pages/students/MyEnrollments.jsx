import React, { useState } from "react";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { Line } from "rc-progress";
import Footer from "../../components/students/Footer";

const MyEnrollments = () => {
  const { enrolledCourses, calculateCourseDuration, navigate } =
    useContext(AppContext);
  const [progressArray, setProgressArray] = useState([
    { lectureCompleted: 2, totalLectures: 4 },
    { lectureCompleted: 1, totalLectures: 4 },
    { lectureCompleted: 3, totalLectures: 5 },
    { lectureCompleted: 4, totalLectures: 6 },
    { lectureCompleted: 0, totalLectures: 4 },
    { lectureCompleted: 5, totalLectures: 6 },
    { lectureCompleted: 6, totalLectures: 6 },
    { lectureCompleted: 2, totalLectures: 8 },
    { lectureCompleted: 4, totalLectures: 6 },
    { lectureCompleted: 3, totalLectures: 10 },
    { lectureCompleted: 7, totalLectures: 7 },
    { lectureCompleted: 1, totalLectures: 4 },
    { lectureCompleted: 0, totalLectures: 2 },
    { lectureCompleted: 5, totalLectures: 5 },
  ]);
  return (
    <>
      <div className="md:px-36 px-8 pt-10">
        <h1 className="text-2xl font-semibold m-4">My Enrollments</h1>
        <table className="md:table-auto w-full overflow-hidden table-fixed border-mt-10">
          <thead className="text-gray-900 text-sm border-b border-gray-500/20 text-left max-sm:hidden">
            {/* <tr className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3"> */}
            <tr className="">
              <th className="py-3 px-4 font-semibold truncate">Course</th>
              <th className="py-3 px-4 font-semibold truncate">Duration</th>
              <th className="py-3 px-4 font-semibold truncate">Completed</th>
              <th className="py-3 px-4 font-semibold truncate">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {enrolledCourses.map((course, index) => (
              <tr key={index} className="border-b border-gray-500/20">
                <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3">
                  <img
                    className="w-14 sm:w-24 md:2-28 py-3"
                    src={course.courseThumbnail}
                    alt="course-thumbnail"
                  />
                  <div className="flex-1">
                    <p className="mb-1 max-sm:text-sm">{course.courseTitle}</p>
                    <Line
                      percent={
                        progressArray[index]
                          ? (progressArray[index].lectureCompleted /
                              progressArray[index].totalLectures) *
                            100
                          : 0
                      }
                      strokeWidth={2}
                      className="bg-gray-300 rounded-full"
                    ></Line>
                  </div>
                </td>
                <td className="px-4 py-3 max-sm:hidden">
                  {calculateCourseDuration(course)}
                </td>
                <td className="px-4 py-3 max-sm:hidden">
                  {progressArray[index] &&
                    `${progressArray[index].lectureCompleted} / ${progressArray[index].totalLectures}`}{" "}
                  <span>Lectures</span>
                </td>
                <td className="px-4 py-3 max-sm:text-right">
                  <button
                    onClick={() => navigate("/player/" + course._id)}
                    className="px-3 cursor-pointer md:px-5 py-1.5 md:py-2 bg-blue-600 text-white max-sm:text-xs"
                  >
                    {progressArray[index] &&
                    progressArray[index].lectureCompleted /
                      progressArray[index].totalLectures ===
                      1
                      ? "Completed"
                      : "On Going"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  );
};

export default MyEnrollments;
