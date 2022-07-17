import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
  if (type == "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  if (type == "CommentCreated") {
    const { id, content, status, postId } = data;

    posts[postId].comments.push({ id, content, status });
  }

  if (type == "CommentUpdated") {
    const { id, content, status, postId } = data;

    const comments = posts[postId].comments;
    const comment = comments.find((c) => c.id == id);

    comment.status = status;
    comment.content = content;
  }
};

app.get("/posts", (req, res) => {
  res.status(200).json(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;

  handleEvent(type, data);

  res.status(200).json({});
});

app.listen(3335, async () => {
  console.log("query service listening on port 3335");

  try {
    const res = await axios.get("http://event-bus-srv:3332/events");

    for (const event of res.data) {
      console.log("Processing event of type " + event.type);
      handleEvent(event.type, event.data);
    }
  } catch (err) {
    console.log("Failed to load events: " + err);
  }
});
