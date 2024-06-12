import React, { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";
const Comments = ({ postid }) => {
  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery(
    ["comments" + postid],
    async () => {
      return await makeRequest.get("/comments?postid=" + postid).then((res) => {
        return res.data;
      });
    }
  );
  const [comment, setComment] = useState("");

  const queryClient = useQueryClient();
  const mutation = useMutation(
    (comment) => {
      makeRequest
        .post("/comments?postid=" + postid, { descr: comment })
        .then((res) => res.data);
    },
    {
      onSuccess: () => {
        //Invalidate and refetch
        queryClient.invalidateQueries(["comments" + postid]);
      },
    }
  );

  const handleClick = (e) => {
    e.preventDefault();
    mutation.mutate(comment);
    setComment("");
  };

  return (
    <div className="comments" key={postid}>
      <div className="write">
        <img src={currentUser.profilepic} alt="" />
        <input
          type="text"
          placeholder="Write n comment.."
          onChange={(e) => {
            setComment(e.target.value);
          }}
          value={comment}
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {error
        ? "Something went wrong!"
        : isLoading
        ? "loading"
        : data.map((comment) => {
            return (
              <div className="comment" key={comment.id}>
                <img src={comment.profilepic} alt="" />
                <div className="info">
                  <span>{comment.name}</span>
                  <p>{comment.descr}</p>
                </div>
                <span className="date">
                  {moment(comment.createdat).fromNow()}
                </span>
              </div>
            );
          })}
    </div>
  );
};

export default Comments;
