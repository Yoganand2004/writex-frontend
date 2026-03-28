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
    <>
    
    </>
    
  );
}