import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/students/Loading";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import Footer from "../../components/students/Footer";
import YouTube from "react-youtube";
import { toast } from "react-toastify";
import axios from "axios";

const CourseDetails = () => {
  const { id } = useParams();
  const {
    currency,
    allCourses,
    calculateRating,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    backendUrl, userData, getToken
  } = useContext(AppContext);
  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [playerData, setPlayerData] = useState(null);
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const fetchCourseData = async () => {
    console.log(allCourses);
    const findCourse = allCourses.find((course) => course._id === id);
    setCourseData(findCourse);
  };
  // can be used when this application can easily fulfill all the endpoints with no problems
  // const fetchCourseData = async () => {
  //   try {
  //     const { data } = await axios.get(backendUrl + '/api/course/' + id);
  //     if (data.success) {
  //       setCourseData(data.courseData);
  //     }
  //     else {
  //       toast.error(data.message);
  //     }
  //   } catch (error) {
  //     toast.error(error.message);
  //   }
  // };
  // useEffect(() => {
  //   if (allCourses.length > 0) {
  //     fetchCourseData();
  //   }
  //   // eslint-disable-next-line
  // }, []);

  const enrollCourse = async () => {
    try {
      if (!userData) {
        return toast.warn('Login to Enroll');
      }
      if (isAlreadyEnrolled) {
        return toast.warn('Already Enrolled');
      }
      const token = await getToken();
      const { data } = await axios.post(backendUrl + '/api/user/purchase', { courseId: courseData._id }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (data.success) {
        const { session_url } = data;
        window.location.replace(session_url);
      }
      else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    if (allCourses.length > 0) {
      fetchCourseData();
    }
    // eslint-disable-next-line
  }, [allCourses]);

  useEffect(() => {
    if (userData && courseData) {
      setIsAlreadyEnrolled(userData.enrolledCourses.includes(courseData._id));
    }
  }, [userData, courseData]);

  const toggleSection = (index) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return courseData ? (
    <>
      <div className="flex md:flex-row flex-col-reverse gap-32 items-start text-left px-8 md:px-36 pt-20 md:pt-25 relative">
        <div className="w-full absolute left-0 top-0 h-section-height bg-gradient-to-b from-cyan-100/70"></div>
        {/* left column */}
        <div className="max-w-xl z-10 text-gray-500">
          <h1 className="text-gray-800 font-semibold text-[26px] md:text-[36px]">
            {courseData.courseTitle}
          </h1>
          <p
            className="pt-6 md:text-base text-sm"
            dangerouslySetInnerHTML={{
              __html: courseData.courseDescription.slice(0, 200),
            }}
          ></p>
          {/* review and ratings */}
          <div className="flex items-center space-x-2 mt-2">
            <p>{calculateRating(courseData)}</p>
            <div className="flex justify-start">
              {[...Array(5)].map((_, i) => (
                <img
                  key={i}
                  src={
                    i < Math.floor(calculateRating(courseData))
                      ? assets.star
                      : assets.star_blank
                  }
                  className="w-3.5 h-3.5"
                  alt="rating"
                />
              ))}
            </div>
            <p className="text-blue-500">
              ({courseData.courseRatings.length}){" "}
              {courseData.courseRatings.length > 1 ? "ratings" : "rating"}
            </p>
            <p className="text-gray-500/50">
              {courseData.enrolledStudents.length}{" "}
              {courseData.enrolledStudents.length > 1 ? "students" : "student"}
            </p>
          </div>
          <p className="text-sm">
            Course by{" "}
            <span className="text-blue-500 underline">{courseData.educator.name ? courseData.educator.name : 'GreatStack'}</span>
          </p>
          <div className="pt-8 text-gray-800">
            <h2 className="font-semibold text-xl">Course Structure</h2>
            <div className="pt-5">
              {courseData.courseContent.map((chapter, index) => (
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
                      {chapter.chapterContent.map((lecture, index) => (
                        <li key={index} className="flex items-start gap-2 py-1">
                          <img
                            src={assets.play_icon}
                            alt="play_icon"
                            className="w-4 h-4 mt-1"
                          />
                          <div className="flex items-center w-full justify-between text-sm md:text-[15px] text-gray-800">
                            <p>{lecture.lectureTitle}</p>
                            <div className="flex gap-2">
                              {lecture.isPreviewFree && (
                                <p
                                  onClick={() =>
                                    setPlayerData({
                                      videoId: lecture.lectureUrl
                                        .split("/")
                                        .pop(),
                                    })
                                  }
                                  className="text-blue-500 cursor-pointer"
                                >
                                  Preview
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
            <div className="py-20 text-sm md:text-[15px]">
              <h3 className="font-semibold text-gray-800 text-xl">
                Course Description
              </h3>
              <p
                className="pt-3 md:text-base text-sm rich-text"
                dangerouslySetInnerHTML={{
                  __html: courseData.courseDescription,
                }}
              ></p>
            </div>
          </div>
        </div>
        {/* right column */}
        <div className="z-10 bg-white boxShadow max-w-[424px] rounded-t md:rounded-none overflow-hidden min-w-[300px] sm:min-w-[420px]">
          {playerData ? (
            <YouTube
              videoId={playerData.videoId}
              opts={{
                playerVars: { autoplay: 1 },
              }}
              iframeClassName="w-full aspect-video"
            />
          ) : (
            <img src={courseData.courseThumbnail} alt="course thumbnail" />
          )}
          <div className="p-6">
            <div className=" flex items-center gap-2">
              <img
                src={assets.time_left_clock_icon}
                alt="time_left_clock_icon"
              />
              <p className="text-red-500">
                <span className="font-medium">5 days</span> left at this price
              </p>
            </div>
            <div className="flex items-center gap-3 pt-3">
              <p className="md:text-4xl text-2xl text-gray-800 font-semibold">
                {currency}{" "}
                {(
                  courseData.coursePrice -
                  (courseData.coursePrice * courseData.discount) / 100
                ).toFixed(2)}
              </p>
              <p className="md:text-lg line-through text-gray-500">
                {courseData.coursePrice}
              </p>
              <p className="text-gray-500 md:text-lg ">
                {courseData.discount} % off
              </p>
            </div>
            <div className="flex items-center md:text-[15px] text-sm text-gray-500 pt-2 md:pt-4 gap-4">
              <div className="flex items-center gap-1">
                <img src={assets.star} alt="star icon" />
                <p>{calculateRating(courseData)}</p>
              </div>
              <div className="w-px h-4 bg-gray-500/40"></div>
              <div className="flex items-center gap-1">
                <img src={assets.time_clock_icon} alt="time clock icon" />
                <p>{calculateCourseDuration(courseData)}</p>
              </div>
              <div className="w-px h-4 bg-gray-500/40"></div>
              <div className="flex items-center gap-1">
                <img src={assets.lesson_icon} alt="lesson icon" />
                <p>{calculateNoOfLectures(courseData)} lessons</p>
              </div>
            </div>
            <div>
              <button onClick={enrollCourse} className="w-full text-sm text-white py-3 font-medium md:mt-6 bg-blue-500 rounded-lg cursor-pointer mt-4">
                {isAlreadyEnrolled ? "Already Enrolled" : "Enroll Now"}
              </button>
            </div>
            <div className="pt-6">
              <p className="md:text-xl text-lg font-medium text-gray-800">
                What's in the course ?
              </p>
              <ul className="pl-4 list-disc text-gray-600 pt-2 text-sm md:text-[15px]">
                <li>Lifetime access with free updates.</li>
                <li>Step-by-step, hands-on project guidance.</li>
                <li>Downloadable resources and source code.</li>
                <li>Quizzes to test your knowledge.</li>
                <li>Certificate of completion.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default CourseDetails;
