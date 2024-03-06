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
});

medecinSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

medecinSchema.set("toJSON", {
  virtuals: true,
});

exports.Medecin = mongoose.model("Medecin", medecinSchema);
exports.medecinSchema = medecinSchema;


 
