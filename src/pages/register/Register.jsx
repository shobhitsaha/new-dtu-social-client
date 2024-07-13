import React, { useState, useContext } from "react";
import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { makeRequest } from "../../axios";

export const Register = () => {
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });
  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await makeRequest.post("/auth/register", {
        ...inputs,
        profile:
          "https://res.cloudinary.com/dcixsckwx/image/upload/v1690131532/blank-cover.jpg",
        cover:
          "https://res.cloudinary.com/dcixsckwx/image/upload/v1690131532/blank-profile.jpg",
      });
      await login({ username: inputs.username, password: inputs.password });
      navigate("/");
    } catch (err) {
      setErr(err.response.data.code);
    }
  };
  const { login } = useContext(AuthContext);

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>DTU Social.</h1>
          <p>
            You can Signup or Login using test credentials, once you login in
            you can post pictures, see older posts, their likes and comments by
            other people Test Login Credentials:
            <div>Username :</div>
            <div>Password :</div>
            <div>Username :</div>
            <div>Password :</div>
            <br />
          </p>
          <span>have an account?</span>
          <Link to="/login">
            <button>Hop in Then!</button>
          </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
          <form action="">
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Name"
              name="name"
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Email"
              name="email"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
            {err && err}
            <button onClick={handleClick}>Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
