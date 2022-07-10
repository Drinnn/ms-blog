import React, { useState } from "react";
import axios from "axios";

const CommentCreate = ({ postId }) => {
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post(`http://localhost:3334/posts/${postId}/comments`, {
      content,
    });

    setContent("");
  };

  return (
    <div>
      <form className="form-group mb-2">
        <label>New Comment</label>
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          type="text"
          className="form-control"
        />
      </form>
      <button onClick={handleSubmit} className="btn btn-primary">
        Submit
      </button>
    </div>
  );
};

export default CommentCreate;
