import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { randomBytes } from "crypto";
import axios from "axios";

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  res.status(200).json(posts);
});

app.post("/posts", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;
  const post = { id, title };

  posts[id] = post;

  await axios.post("http://event-bus-srv:3332/events", {
    type: "PostCreated",
    data: post,
  });

  res.status(201).json(post);
});

app.post("/events", (req, res) => {
  console.log("received event:", req.body.type);

  res.status(200).json({});
});

app.listen(3333, () => {
  console.log("posts service started on port 3333...");
});
