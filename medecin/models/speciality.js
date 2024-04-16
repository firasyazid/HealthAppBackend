

const mongoose = require('mongoose');

const specilitySchema = new mongoose.Schema({
    description: {
        type: String,
        default: null,
     },
    titre: {
        type: String,
        required: true,
    },
    icon : { 
        type: String,
        required: true,
    },
});

specilitySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

specilitySchema.set('toJSON', {
    virtuals: true,
});

exports.Speciality = mongoose.model('Speciality', specilitySchema);
exports.specilitySchema = specilitySchema;
