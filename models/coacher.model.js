const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const coacherSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  school: {
    type: String,
    required: true,
  },
  slug: String
});

module.exports = mongoose.model("Coacher", coacherSchema);
