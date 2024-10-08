import { AiOutlineBars } from "react-icons/ai";
import { FcSettings } from "react-icons/fc";
import { GrLogout } from "react-icons/gr";

import { Link, NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useState } from "react";
import MenuItem from "./componesnts/menu/MenuItem";
import { BsGraphUp } from "react-icons/bs";
import HostMenu from "./componesnts/menu/HostMenu";
import useRole from "../../hooks/useRole";

import GuestMenu from "./componesnts/menu/GuestMenu";
import AdminMenu from "./componesnts/menu/AdminMenu";
import ToggleBtn from "../Button/ToggleBtn";
import LoadingSpinner from "../Shared/LoadingSpinner";

const Sidebar = () => {
  const { logOut  ,  loading} = useAuth();
  const [role] = useRole();

  const [isActive, setActive] = useState(false);

  // Sidebar Responsive Handler
  const handleToggle = () => {
    setActive(!isActive);
  };

  const [toggole, setToggle] = useState(true);

  const toggleHandler = () => {
    setToggle(!toggole);
  };

  if(loading) return <LoadingSpinner></LoadingSpinner>


 

  return (
    <>
      {/* Small Screen Navbar */}
      <div className="bg-gray-100   text-gray-800 flex justify-between md:hidden">
        <div>
          <div className="block  cursor-pointer p-4 font-bold">
            <Link to="/">
              <img src="https://i.ibb.co/4ZXzmq5/logo.png" alt="logo" width="100" height="100" />
            </Link>
          </div>
        </div>

        <button onClick={handleToggle} className="mobile-menu-button p-4 focus:outline-none focus:bg-gray-200">
          <AiOutlineBars className="h-5 w-5" />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`z-10 md:fixed  flex flex-col justify-between overflow-x-hidden bg-gray-100 inset-y-0 w-64 space-y-6 px-2 py-4 absolute h-screen left-0 transform ${
          isActive && "-translate-x-full"
        }  md:translate-x-0  transition duration-200 ease-in-out`}
      >
        <div>
          <div>
            <div className="w-full hidden md:flex px-4 py-2 shadow-lg rounded-lg justify-center items-center bg-rose-100 mx-auto">
              <Link to="/">
                <img
                  // className='hidden md:block'
                  src="https://i.ibb.co/4ZXzmq5/logo.png"
                  alt="logo"
                  width="100"
                  height="100"
                />
              </Link>
            </div>
          </div>

          {/* Nav Items */}
          <div className="flex flex-col justify-between flex-1 mt-6">
            {/* Conditional toggle button here.. */}
            {role === "host" && <ToggleBtn toggole={toggole} toggleHandler={toggleHandler}></ToggleBtn>}

            {/*  Menu Items */}
            <nav>
              {/* Statistics */}
              <MenuItem label="Statistics" address="/dashboard" icon={BsGraphUp}></MenuItem>
              {role == "host" ? toggole? <HostMenu></HostMenu> :<GuestMenu></GuestMenu> :undefined }
              {role == "guest" && <GuestMenu></GuestMenu>}
              {role == "admin" && <AdminMenu></AdminMenu>}
            </nav>
          </div>
        </div>

        <div>
          <hr />

          {/* Profile Menu */}
          <NavLink
            to="/dashboard/profile"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 my-5  transition-colors duration-300 transform  hover:bg-gray-300   hover:text-gray-700 ${
                isActive ? "bg-gray-300  text-gray-700" : "text-gray-600"
              }`
            }
          >
            <FcSettings className="w-5 h-5" />

            <span className="mx-4 font-medium">Profile</span>
          </NavLink>
          <button
            onClick={logOut}
            className="flex w-full items-center px-4 py-2 mt-5 text-gray-600 hover:bg-gray-300   hover:text-gray-700 transition-colors duration-300 transform"
          >
            <GrLogout className="w-5 h-5" />

            <span className="mx-4 font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
