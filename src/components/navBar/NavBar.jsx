import React, { useContext, useState } from "react";
import "./navBar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, useNavigate } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import { makeRequest } from "../../axios";
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from "@coreui/react";
import "@coreui/coreui/dist/css/coreui.min.css";

const Navbar = () => {
  const { darkMode, toggle } = useContext(DarkModeContext);
  const { currentUser, logout } = useContext(AuthContext);

  const [text, setText] = useState("");

  const handleInput = (e) => {
    setText(e.target.value);
  };
  const navigate = useNavigate();
  const handleClick = async () => {
    const data = await makeRequest
      .get("/users/findId?username=" + text)
      .then((res) => {
        return parseInt(res.data);
      })
      .catch((err) => {
        return parseInt(err.response.data);
      });

    console.log(text);
    navigate("/profile/" + data);
    navigate(0);
  };

  const logoutButton = (
    <LogoutIcon onClick={logout} style={{ cursor: "pointer" }} />
  );
  const profileButton = (
    <Link
      to={`/profile/${currentUser.id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div className="user">
        <span>{currentUser.name}</span>
        <img src={currentUser.profilepic} alt="" />
      </div>
    </Link>
  );

  return (
    <div className="navBar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span>dtuSocial</span>
        </Link>

        <Link
          to="/"
          style={{ textDecoration: "none", marginTop: "auto", width: "100%" }}
        >
          <span>
            <HomeOutlinedIcon className="icon" title="home" />
          </span>
        </Link>

        {darkMode ? (
          <WbSunnyOutlinedIcon onClick={toggle} style={{ cursor: "pointer" }} />
        ) : (
          <DarkModeOutlinedIcon
            onClick={toggle}
            style={{ cursor: "pointer" }}
          />
        )}
        <GridViewOutlinedIcon className="mobIcon" />
        <div>
          <form onSubmit={handleClick} className="search">
            <input
              type="text"
              placeholder="search username"
              onChange={handleInput}
              value={text}
            />
            <button type="submit">
              <SearchOutlinedIcon />
            </button>
          </form>
        </div>
        <CDropdown className="mob">
          <CDropdownToggle color="secondary"></CDropdownToggle>
          <CDropdownMenu style={{ maxWidth: "10px" }}>
            <CDropdownItem>{profileButton}</CDropdownItem>
            <CDropdownItem>Notification</CDropdownItem>
            <CDropdownItem onClick={logout}>Logout</CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
      </div>

      <div className="right">
        <PersonOutlinedIcon className="mobIcon" />
        <EmailOutlinedIcon className="mobIcon" />
        <NotificationsOutlinedIcon className="mobIcon" />
        {logoutButton}
        {profileButton}
      </div>
    </div>
  );
};

export default Navbar;
