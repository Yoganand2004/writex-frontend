import React, { useState, useEffect } from 'react';

import {toast} from 'react-toastify'
import './Login_Signup.css'
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData]= useState({
    name:'',
    email:'',
    password:'',
    confirmPassword:''
  })
  const handleChange = (e) =>{
    console.log(e.target.name);
    
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })

  }
  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 5) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    const{confirmPassword, ...dataToSend} =formData

    const response = await fetch("https://anywherewritex.onrender.com/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dataToSend)
    });

    const result = await response.json();
    console.log("Log",result);
    

    if (!response.ok) {
      throw new Error(result.message || "Signup failed");
    }
    if(result.success){
      setTimeout(()=>{
        
      toast.success("Successfully Sign Up 🎉");
    navigate("/login")
      },1000)

    }

    

  } catch (err) {
    toast.error(err.message || "Something went wrong");
  }
};

  return (
    
        <div className="container vh-100 d-flex justify-content-center align-items-center">
          <div className="card p-4 shadow" style={{backgroundColor:'white', width:"500px"}}>

      <form className="signUp-box" onSubmit={handleSubmit}>
      
        <h2 className="text-center mb-3">Sign Up</h2>
        <input
          type="text"
          name="name"
          placeholder="Enter Name"
          autoFocus
          value={formData.name}
          onChange={handleChange}
        />
        
        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
        />
        
        <input
          type="password"
          name="confirmPassword"
          placeholder="Enter Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        <button type="submit">Sign Up</button>
      </form>
      
    </div>

    </div>
  );
}

export default Signup;