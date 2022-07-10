import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
app.use(bodyParser.json());

const events = [];

app.post("/events", (req, res) => {
  const event = req.body;
  events.push(event);

  axios
    .post("http://localhost:3333/events", event)
    .catch((err) => console.log(err));
  axios
    .post("http://localhost:3334/events", event)
    .catch((err) => console.log(err));
  axios
    .post("http://localhost:3335/events", event)
    .catch((err) => console.log(err));
  axios
    .post("http://localhost:3336/events", event)
    .catch((err) => console.log(err));

  res.status(200).json({ status: "ok" });
});

app.get("/events", (req, res) => {
  res.status(200).json(events);
});
app.listen(3332, () => {
  console.log("event bus is running on port 3332...");
});
