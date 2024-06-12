import { createContext, useEffect, useState } from "react";
import { makeRequest } from "../axios";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  let info = JSON.parse(localStorage.getItem("user")) || false;
  const [currentUser, setCurrentUser] = useState(info);

  const logout = async (inputs) => {
    await makeRequest.post("/auth/logout");
    setCurrentUser(false);
    localStorage.removeItem("user");
  };

  const login = async (inputs) => {
    await logout();
    const res = await makeRequest.post("/auth/login", inputs, {
      withCredentials: true,
    });
    setCurrentUser(res.data);
  };

  const update = async (inputs) => {
    const res = await makeRequest.put("/users/update", inputs, {
      withCredentials: true,
    });
    console.log("authContext");
    setCurrentUser(res.data);
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, update, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
