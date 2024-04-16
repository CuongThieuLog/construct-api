const mongoose = require("mongoose");

const InformationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    birthday: {
      type: Date,
    },
    address: {
      type: String,
    },
  },
  { timestamps: true }
);

const Information = mongoose.model("Information", InformationSchema);

module.exports = Information;
