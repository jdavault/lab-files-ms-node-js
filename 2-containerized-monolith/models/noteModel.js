import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    require: [true, "Note must have title"],
  },
  body: {
    type: String,
    required: [true, "Note must have body"],
  },
});

export const Note = mongoose.model("Note", noteSchema);
