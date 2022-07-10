import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post("/events", async (req, res) => {
  const event = req.body;

  if (event.type === "CommentCreated") {
    const comment = event.data;
    const status = comment.content.toLowerCase().includes("fuck")
      ? "rejected"
      : "approved";

    await axios.post("http://localhost:3332/events", {
      type: "CommentModerated",
      data: {
        id: comment.id,
        content: comment.content,
        status,
        postId: comment.postId,
      },
    });

    res.status(200).json({});
  }
});

app.listen(3336, () => {
  console.log("moderation service is running on port 3336...");
});
