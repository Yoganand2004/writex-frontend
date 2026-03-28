import React, { useEffect, useState } from "react";
import { Link, Navigate ,useNavigate} from "react-router-dom";
import "./Login_Signup.css";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try{
      if(!email || !password){
        toast.error('All field Required')
      return;
    }
    if (password.length < 5) {
          toast.error("Password must be at least 5 characters");
          return;
        }
        const response = await fetch("https://anywherewritex.onrender.com/auth/login", {
          method: "POST",
          credentials:"include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({email,password})
        });
        const result = await response.json();
          console.log(result);
         if (!response.ok) {
        toast.error(result?.error?.details?.[0]?.message || result.message || "Login failed");
        return;
      }
      else{
        toast.success("Login successful")
        localStorage.setItem("JWT Token",result.token)
        Cookies.set("token", result.token, { expires: 7 });
        localStorage.setItem("LoggedInUser",result.name)
        setTimeout(() => {
          navigate("/Home")
        }, 2000);
      }
    }
    catch (error) {
      toast.error(error.message || "Login failed");
    }
    
    
  };

  return (
    <div className="login-container">

      <form className="login-box" onSubmit={handleLogin}>
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>

        <p>
          Don’t have an account? <Link to="/signup">Open Now</Link>
        </p>

      </form>

    </div>
  );
}

export default Login;