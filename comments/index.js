import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { randomBytes } from "crypto";
import axios from "axios";

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  const postId = req.params.id;
  const comments = commentsByPostId[postId] || [];

  return res.status(200).json(comments);
});

app.post("/posts/:id/comments", async (req, res) => {
  const postId = req.params.id;
  const comments = commentsByPostId[postId] || [];
  const { content } = req.body;

  const comment = {
    id: randomBytes(4).toString("hex"),
    content,
    status: "pending",
  };

  comments.push(comment);
  commentsByPostId[postId] = comments;

  await axios.post("http://localhost:3332/events", {
    type: "CommentCreated",
    data: {
      ...comment,
      postId,
    },
  });

  return res.status(201).json(comment);
});

app.post("/events", async (req, res) => {
  const event = req.body;

  if (event.type === "CommentModerated") {
    const comment = event.data;
    const comments = commentsByPostId[comment.postId];
    const commentIndex = comments.findIndex((c) => c.id === comment.id);
    comments[commentIndex] = comment;

    await axios.post("http://localhost:3332/events", {
      type: "CommentUpdated",
      data: comment,
    });
  }

  res.status(200).json({});
});

app.listen(3334, () => {
  console.log("comments service started on port 3334...");
});
