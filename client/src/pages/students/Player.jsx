import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useParams } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import { assets } from "../../assets/assets";
import YouTube from "react-youtube";
import Footer from "../../components/students/Footer";
import Rating from "../../components/students/Rating";
import { toast } from "react-toastify";
import Loading from "../../components/students/Loading";

const Player = () => {
  const { enrolledCourses, calculateChapterTime, backendUrl, userData, fetchUserEnrolledCourses, getToken } = useContext(AppContext);
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [playerData, setPlayerData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [initialRating, setInitialRating] = useState(0);
  const [openSections, setOpenSections] = useState({});

  const getCourseData = () => {
    enrolledCourses.map((course) => {
      if (course._id === courseId) {
        setCourseData(course);
        // course.courseRatings.map((item) => {
        //   if (item.userId === userData._id) {
        //     setInitialRating(item.Rating);
        //   }
        // })
      }
    });
  };

  // useEffect(() => {
  //   if (enrolledCourses.length > 0) {
  //     getCourseData();
  //   }
  // }, [enrolledCourses]);

  // const markLecturesAsCompleted = async () => {
  //   try {
  //     const token = await getToken();
  //     const { data } = await axios.post(backendUrl + '/api/user/update-course-progress', { courseId, lectureId }, {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     })
  //     if (data.success) {
  //       toast.success(data.message);
  //       getCourseProgress();
  //     }
  //     else {
  //       toast.error(data.message);
  //     }
  //   }
  //   catch (error) {
  //     toast.error(error.message);
  //   }
  // };

  // const getCourseProgress = async () => {
  //   try {
  //     const token = await getToken();

  //     const { data } = await axios.post(`${backendUrl}/api/user/get-course-progress`, { courseId }, {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     })
  //     if (data.success) {
  //       setProgressData(data.progressData);
  //     }
  //     else {
  //       toast.error(data.message);
  //     }
  //   }
  //   catch (error) {
  //     toast.error(error.message);
  //   }
  // }

  // const handleRate = async (rating) => {
  //   try {
  //     const token = await getToken();

  //     const { data } = await axios.post(`${backendUrl}/api/user/add-rating`, { courseId, rating }, {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     })
  //     if (data.success) {
  //       toast.success(data.message);
  //       fetchUserEnrolledCourses();
  //     }
  //     else {
  //       toast.error(data.message);
  //     }
  //   }
  //   catch (error) {
  //     toast.error(error.message);
  //   }
  // }

  // useEffect(() => {
  //   getCourseProgress();
  // }, []);

  useEffect(() => {
    getCourseData();
  }, [enrolledCourses]);
  const toggleSection = (index) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };
  return courseData ? (
    <>
      <div className="p-4 md:p-10 flex flex-col-reverse min-h-screen md:grid md:grid-cols-2 gap-10 md:px-36">
        {/* left column */}
        <div className="text-gray-800">
          <h2 className="font-semibold text-xl">Course Structure</h2>
          <div className="pt-5">
            {courseData &&
              courseData.courseContent.map((chapter, index) => (
                <div
                  key={index}
                  className="border border-gray-300 mb-2 bg-white rounded"
                >
                  <div
                    className="flex sm:flex-row flex-col text-left justify-between items-center select-none py-3 px-4 cursor-pointer"
                    onClick={() => {
                      toggleSection(index);
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        className={`transform transition-transform ${openSections[index] ? "rotate-180" : ""
                          }`}
                        src={assets.down_arrow_icon}
                        alt="down_arrow_icon"
                      />
                      <p className="md:text-base text-sm font-semibold">
                        {chapter.chapterTitle}
                      </p>
                    </div>
                    <p className="text-sm md:text-[15px]">
                      {chapter.chapterContent.length} lectures -{" "}
                      {calculateChapterTime(chapter)}
                    </p>
                  </div>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${openSections[index] ? "max-h-96" : "max-h-0"
                      }`}
                  >
                    <ul className="list-disc border-t pl-4 md:pl-10 pr-4 py-2 border-gray-300 text-gray-600">
                      {chapter.chapterContent.map((lecture, i) => (
                        <li key={i} className="flex items-start gap-2 py-1">
                          <img
                            src={
                              false ? assets.blue_tick_icon : assets.play_icon
                            }
                            alt="play_icon"
                            className="w-4 h-4 mt-1"
                          />
                          <div className="flex items-center w-full justify-between text-sm md:text-[15px] text-gray-800">
                            <p>{lecture.lectureTitle}</p>
                            <div className="flex gap-2">
                              {lecture.lectureUrl && (
                                <p
                                  onClick={() =>
                                    setPlayerData({
                                      ...lecture,
                                      chapter: index + 1,
                                      lecture: i + 1,
                                    })
                                  }
                                  className="text-blue-500 cursor-pointer"
                                >
                                  Watch
                                </p>
                              )}
                              <p>
                                {humanizeDuration(
                                  lecture.lectureDuration * 60 * 1000,
                                  { units: ["h", "m"] }
                                )}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
          </div>
          <div className="flex py-2 mt-10 gap-2  items-center">
            <h2 className="font-bold text-xl">Rate this course : </h2>
            <Rating initialRating={initialRating} />
            {/* <Rating initialRating={initialRating} onRate = {handleRate} /> */}
          </div>
        </div>
        {/* right column */}
        <div className="md:mt-10">
          {playerData ? (
            <div>
              <YouTube
                iframeClassName="w-full aspect-video"
                videoId={playerData.lectureUrl.split("/").pop()}
              />
              <div className="flex items-center justify-between mt-3">
                <p>
                  {playerData.chapter}.{playerData.lecture}{" "}
                  {playerData.lectureTitle}
                </p>
                <button className="text-blue-600">
                  {false ? "Completed" : "Mark Complete"}
                </button>
                {/* <button onClick={() => markLectureAsCompleted(playerData.lectureId)} className="text-blue-600">
                  {progressData && progressData.lectureCompleted.includes(playerData.lectureId) ? "Completed" : "Mark Complete"}
                </button> */}
              </div>
            </div>
          ) : (
            <img
              src={courseData ? courseData.courseThumbnail : null}
              alt="courseThumbnail"
            />
          )}
        </div>
      </div>
      <Footer />
    </>
  ) : <Loading />
};

export default Player;
