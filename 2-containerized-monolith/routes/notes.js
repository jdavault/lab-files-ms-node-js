
import express from 'express'
import { Note } from "../models/noteModel.js";

const router = express.Router()

router.get("/api/notes", async (req, res) => {
  try {
    const notes = await Note.find();
    res.status(200).json({
      notes,
    });
  } catch (e) {
    console.log(e);

    res.status(400).json({
      status: "fail",
    });
  }
});

router.get("/api/notes/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }
    return res.status(200).json({
      note,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      status: "fail",
    });
  }
});

router.post("/api/notes", async (req, res) => {
  console.log(req.body);
  try {
    const note = await Note.create(req.body);

    return res.status(201).json({
      note,
    });
  } catch (e) {
    console.log(e);

    return res.status(400).json({
      status: "fail",
    });
  }
});

router.patch("/api/notes/:id", async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }
    res.status(200).json({
      note,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      status: "fail",
    });
  }
});

router.delete("/api/notes/:id", async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    console.log(note);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }
    res.status(200).json({ status: "success" });
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      status: "fail",
    });
  }
});

export default router