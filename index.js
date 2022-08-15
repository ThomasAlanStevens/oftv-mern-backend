//Required dependencies
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const asyncHandler = require("express-async-handler");
const MongoClient = require("mongodb").MongoClient;
const path = require("path");
require("dotenv").config();

//DECLARED DB VARIABLES
let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = "oftv-videos";

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname + "/public")));

// Connect to mongodb
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  client => {
    console.log(`Connected to ${dbName} Database`);
    db = client.db(dbName);
  }
);

// CRUD Operations

// Get Operations

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/addVideo", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get(
  "/getVideoInfo",
  asyncHandler(async (req, res) => {
    let videoInfo = await db.collection("video_info").find().toArray();
    res.json(videoInfo);
  })
);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Add Videos operations
app.post(
  "/addVideo",
  asyncHandler(async (req, res) => {
    console.log(req.body);
    const { title, categories, channel, creator, icon, link, thumbnail } =
      req.body;

    // If any info is not filled out, throw error
    if (
      !title ||
      !categories ||
      !channel ||
      !creator ||
      !icon ||
      !link ||
      !thumbnail
    ) {
      res.status(400);
      throw new Error("Please fill out the entire form.");
    }

    // Create video
    let newVideo = await db.collection("video_info").insertOne({ ...req.body });
    res.sendFile(path.join(__dirname, "public", "index.html"));
  })
);

// Update Video info
app.put(
  "/addVideo",
  asyncHandler(async (req, res) => {
    let updatedVideo = await db.collection("video_info").updateOne(
      { link: req.body.link },
      {
        $set: {
          ...req.body,
        },
      },
      {
        upsert: false,
      }
    );
    res.json("Video updated!");
  })
);

// Delete Video
app.delete(
  "/addVideo",
  asyncHandler(async (req, res) => {
    let deletedVideo = await db
      .collection("video_info")
      .deleteOne({ link: req.body.link });
    res.json(deletedVideo);
  })
);

app.listen(port, () => console.log(`server is running on port ${port}`));
