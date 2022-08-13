//Required dependencies
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Video = require("./models/videoModel");
const path = require("path");
require("dotenv").config();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname + "/public")));

// Connect to mongodb
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_STRING);
    console.log(`MongDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

connectDB();

// CRUD Operations

// Get all videos
app.get(
  "/api/videos",
  asyncHandler(async (req, res) => {
    const videos = await Video.find();
    res.json(videos);
  })
);

// Add video
app.post(
  "/api/videos",
  asyncHandler(async (req, res) => {
    console.log(req.body);
    const {
      title,
      categories,
      channel,
      creator,
      icon,
      link,
      thumbnail,
      watch,
    } = req.body;

    // If any info is not filled out, throw error
    if (
      !title ||
      !categories ||
      !channel ||
      !creator ||
      !icon ||
      !link ||
      !thumbnail ||
      !watch
    ) {
      res.status(400);
      throw new Error("Please fill out the entire form.");
    }

    // If video already exists
    const videoExists = await Video.findOne({ link });
    if (videoExists) {
      res.status(400);
      throw new Error("Video already created");
    }

    // Create video
    const video = await Video.create({
      title,
      categories,
      channel,
      creator,
      icon,
      link,
      thumbnail,
      watch,
    });
    console.log(video);
  })
);

// Updater Video info
// app.put(
//   "/api/users/:id",
//   asyncHandler(async (req, res) => {
//     const user = await User.findById(req.params.id);

//     if (!user) {
//       res.status(400);
//       throw new Error("User not found");
//     }

//     const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body);

//     res.json(updatedUser);
//   })
// );

// Delete Video account
// app.delete(
//   "/api/users/:id",
//   asyncHandler(async (req, res) => {
//     const user = await User.findById(req.params.id);

//     if (!user) {
//       res.status(400);
//       throw new Error("User not found");
//     }

//     await user.remove();

//     res.status(200).json({ id: req.params.id });
//   })
// );

app.listen(port, () => console.log(`server is running on port ${port}`));
