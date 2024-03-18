

var mongoose = require('mongoose');

var regionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    
  
});


regionSchema.virtual('id').get(function () {
    return this._id.toHexString();
}); 

regionSchema.set('toJSON', {
    virtuals: true
});

exports.RegionPharmacy = mongoose.model('RegionPharmacy', regionSchema);
exports.regionSchema = regionSchema;
