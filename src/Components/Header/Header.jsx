import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "./33be6921-e135-48f4-a9cb-1447cdd4c032.png";
import axios from "axios";
import Cookies from "js-cookie";


export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("JWT Token");
  const LoggedInUser = localStorage.getItem("LoggedInUser");

  const handleLogOut = async () => {
    try {
      await axios.post("https://anywherewritex.onrender.com/auth/logout",{},{
        withCredentials: true
      })
    localStorage.removeItem("JWT Token");
    Cookies.remove("token");
    localStorage.removeItem("LoggedInUser");
    setDropdownOpen(false);

    }
    catch (error) {
    console.log(error);
  };
}

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-3">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/">
            <img src={logo} alt="logo" className="h-14" />
          </Link>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center justify-between flex-1 ml-6">

            {/* Nav Links */}
            <ul className="flex items-center gap-8 mx-auto list-none">
              {["/Home", "/About", "/Github"].map((path, i) => (
                <li key={i}>
                  <NavLink
                    to={path}
                    className={({ isActive }) =>
                      `block py-2 px-1 font-medium border-b-2 transition-all duration-300 ease-in-out transform hover:scale-105 ${
                        isActive
                          ? "border-blue-500 text-blue-600 shadow-sm"
                          : "border-transparent text-gray-600 hover:text-blue-500 hover:border-blue-300"
                      }`
                    }
                  >
                    {path === "/" ? "Home" : path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Auth Buttons / User Dropdown */}
            {!token ? (
              <div className="flex items-center gap-3">
                <button
                  className="px-4 py-2 font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition"
                  onClick={() => navigate("/signup")}
                >
                  Sign up
                </button>
                <button
                  className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
                  onClick={() => navigate("/login")}
                >
                  Log in
                </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-blue-100 transition-all duration-200 ease-in-out transform hover:scale-105 text-gray-700 font-medium cursor-pointer"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm hover:shadow-lg transition-shadow">
                    {LoggedInUser?.charAt(0).toUpperCase()}
                  </span>
                  Hi {LoggedInUser}
                  <svg
                    width="12" height="12" viewBox="0 0 24 24"
                    fill="none" stroke="#94a3b8" strokeWidth="2.5"
                    className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : "rotate-0"}`}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <ul className="absolute right-0 top-[110%] w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <li>
                      <button
                        className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                        onClick={handleLogOut}
                      >
                        Log Out
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-gray-100 mt-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <ul className="flex flex-col gap-1 mt-2 list-none">
              {["/Home", "/About", "/Github"].map((path, i) => (
                <li key={i}>
                  <NavLink
                    to={path}
                    className={({ isActive }) =>
                      `block py-2 px-3 rounded-md font-medium transition-all duration-200 ease-in-out transform ${
                        isActive
                          ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600 pl-2"
                          : "text-gray-600 hover:bg-gray-100 hover:text-blue-500 hover:pl-5"
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {path === "/" ? "Home" : path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
                  </NavLink>
                </li>
              ))}
            </ul>

            {!token ? (
              <div className="flex flex-col gap-2 mt-4 px-3">
                <button
                  className="w-full px-4 py-2 font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition"
                  onClick={() => { navigate("/signup"); setMobileMenuOpen(false); }}
                >
                  Sign up
                </button>
                <button
                  className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
                  onClick={() => { navigate("/login"); setMobileMenuOpen(false); }}
                >
                  Log in
                </button>
              </div>
            ) : (
              <div className="mt-4 px-3">
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm">
                    {LoggedInUser?.charAt(0).toUpperCase()}
                  </span>
                  Hi {LoggedInUser}
                </button>
                {dropdownOpen && (
                  <button
                    className="mt-2 w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                    onClick={handleLogOut}
                  >
                    Log Out
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}