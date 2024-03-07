const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  doctor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medecin",
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },

  userName: {
    type: String,
    default: "",
  },
  doctorName: {
    type: String,
    default: "",
  },

  AppHour: {
    day: String,
    hours: String,
  },

});

appointmentSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
appointmentSchema.set("toJSON", {
  virtuals: true,
});

exports.Appointment = mongoose.model("Appointment", appointmentSchema);
exports.appointmentSchema = appointmentSchema;
