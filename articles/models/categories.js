
const mongoose = require('mongoose');



    const categorySchema = new mongoose.Schema({

        Categoryname :{
            type:String
        },
        
         
    });

    categorySchema.virtual('id').get(function () {
        return this._id.toHexString();
    }

    );
    categorySchema.set('toJSON', {
        virtuals: true,
    });

    exports.Categories = mongoose.model('Categories', categorySchema);
    exports.categorySchema = categorySchema;