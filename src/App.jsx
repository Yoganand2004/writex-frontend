import { Link, Routes, Route } from "react-router-dom";
import './App.css'
import './index.css'

import Home from "./Components/Home/home";
import Layout from "./layout/Layout";
import About from "./Components/AboutUs/About";
import User from "./Components/User/User";
import Github from "./Components/Github/Github";
import Login from "./Components/pages/Login";
import Signup from './Components/pages/Signup';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {

  return (
    <>

    <Routes>
  <Route element={<Layout />}>
    <Route path="/" element={<Home />} />
    <Route path="/Home" element={<Home />} />
    <Route path="/About" element={<About />} />
    <Route path="/user/:userID" element={<User />} />
    <Route path="/Github" element={<Github />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
  </Route>
</Routes>

    <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}

export default App;
 
