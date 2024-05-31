const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
     
    email: {
        type: String,
        required: true,
    },
    passwordHash: {
        type: String,
        default: null,
    },
  
    isAdmin: {
        type: Boolean,   
        default:false
    },

    Image: {
        type: String,
        default: null,
    },
    phone: {
        type: String,
        default: null,
    },
  
    
});

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true,
});

exports.User = mongoose.model('User', userSchema);
exports.userSchema = userSchema;
