import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const { isEducator } = useContext(AppContext);
  const menuItems = [
    { name: "Dashboard", path: "/educator", icon: assets.home_icon },
    { name: "Add Course", path: "/educator/add-course", icon: assets.add_icon },
    {
      name: "My Courses",
      path: "/educator/my-course",
      icon: assets.my_course_icon,
    },
    {
      name: "Student Enrolled",
      path: "/educator/student-enrolled",
      icon: assets.person_tick_icon,
    },
  ];
  return (
    isEducator && (
      <div className="w-16 md:w-64 border-r border-gray-500 min-h-screen text-base py-2 flex flex-col">
        {menuItems.map((item) => (
          <NavLink
            to={item.path}
            key={item.name}
            end={item.path === "/educator"}
            className={({ isActive }) =>
              `flex items-center flex-col md:flex-row justify-center md:justify-start py-3.5 md:px-10 gap-3 ${
                isActive
                  ? "border-r-[6px] bg-indigo-50 border-indigo-500/90"
                  : "border-r-[6px] border-white hover:bg-gray-100/90 hover:border-gray-100/90"
              }`
            }
          >
            <img src={item.icon} className="w-6 h-6" alt="" />
            <p className="md:block hidden text-center">{item.name}</p>
          </NavLink>
        ))}
      </div>
    )
  );
};

export default Sidebar;
