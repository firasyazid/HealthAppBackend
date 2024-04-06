var mongoose = require('mongoose');
var typeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
});


typeSchema.virtual('id').get(function () {
    return this._id.toHexString();
}); 

typeSchema.set('toJSON', {
    virtuals: true
});

exports.Type = mongoose.model('Type', typeSchema);
exports.typeSchema = typeSchema;
