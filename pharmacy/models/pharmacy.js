

const mongoose = require("mongoose");

const pharmacySchema = new mongoose.Schema({

    name : {
        type : String,
        required : true
    },
    phone : {
        type : String,
        default : ""
     },
    region : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "RegionPharmacy",
    },
    type : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Type",
    },
    address : {
        type : String,
        default : ""
    },
    location: {
        type: [Number],  
        required: true
    }
  
});

pharmacySchema.virtual("id").get(function () {
  return this._id.toHexString();
});

pharmacySchema.set("toJSON", {
  virtuals: true,
});

exports.Pharmacy = mongoose.model("Pharmacy", pharmacySchema);
exports.pharmacySchema = pharmacySchema;
