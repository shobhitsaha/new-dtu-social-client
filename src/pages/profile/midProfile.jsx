import React, { useContext, useState } from "react";
import "./profile.scss";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/Update/Update";
import errImg from "../../assets/err.png";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const userid = parseInt(useLocation().pathname.split("/")[2]);

  const { isLoading, error, data } = useQuery(["user"], () => {
    return makeRequest
      .get("/users/find/" + userid)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return err.response.data;
      });
  });

  const { isLoading: rIisLoading, data: relationshipData } = useQuery(
    ["relationship"],
    () => {
      return makeRequest
        .get("/relationships?followedUserId=" + userid)
        .then((res) => {
          return res.data;
        });
    }
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (following) => {
      if (following)
        return makeRequest.delete("/relationships?userid=" + userid);
      return makeRequest.post("/relationships", { userid: userid });
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["relationship"]);
      },
    }
  );

  const handleFollow = () => {
    mutation.mutate(relationshipData.includes(currentUser.id));
  };

  if (data === "user not found") {
    return (
      <div className="errContainer">
        <img src={errImg} alt="" />
        <div className="noUser">
          Page not found
          <div>Sorry, but we can't find the page you are looking for...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile">
      {error ? (
        "Something went wrong"
      ) : isLoading ? (
        "loading"
      ) : (
        <>
          <div className="images">
            <img src={data.coverpic} alt="" className="cover" />
            <img src={data.profilepic} alt="" className="profilepic" />
          </div>

          <div className="profileContainer">
            <div className="uInfo">
              <div className="left">
                <span>{data.name}</span>
                <div className="info">
                  <div className="item">
                    <PlaceIcon />
                    <span>{data.city}</span>
                  </div>
                  <div className="item">
                    <LanguageIcon />
                    <span>{data.website}</span>
                  </div>
                </div>
                {userid === currentUser.id ? (
                  <button
                    onClick={() => {
                      setOpenUpdate(true);
                    }}
                  >
                    update
                  </button>
                ) : (
                  <button onClick={handleFollow}>
                    {rIisLoading
                      ? "loading"
                      : relationshipData.includes(currentUser.id)
                      ? "Following"
                      : "Follow"}
                  </button>
                )}
              </div>

              <div className="right">
                <EmailOutlinedIcon />
                <MoreVertIcon />
              </div>
            </div>
            <Posts userid={userid} />
          </div>
        </>
      )}
      {openUpdate && (
        <Update setOpenUpdate={setOpenUpdate} user={currentUser} />
      )}
    </div>
  );
};

export default Profile;
