const mongoose = require("mongoose");

const medecinSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  speciality: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Speciality",
    required: true,
  },
  description : {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "",
  },
  region : {
    type: String,
    default: "",
  },
  workingHours: {
    type: [{
      day: String,
      hours: [String],
    }],
    default: [
      { day: "monday", hours: ["9:00", "10:00", "11:00", "1:00", "2:00", "3:00"] },
      { day: "tuesday", hours: ["9:00", "10:00", "11:00", "1:00", "2:00", "3:00"] },
      { day: "wednesday", hours: ["9:00", "10:00", "11:00", "1:00", "2:00", "3:00"] },
      { day: "thursday", hours: ["9:00", "10:00", "11:00", "1:00", "2:00", "3:00"] },
      { day: "friday", hours: ["9:00", "10:00", "11:00", "1:00", "2:00", "3:00"] },
    ], 
  },
});

medecinSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

medecinSchema.set("toJSON", {
  virtuals: true,
});

exports.Medecin = mongoose.model("Medecin", medecinSchema);
exports.medecinSchema = medecinSchema;
