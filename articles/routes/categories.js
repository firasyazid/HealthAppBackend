const express = require('express');
const router = express.Router();
const { Categories } = require('../models/categories');
 



router.get('/', async (req, res) => {
    const categories = await Categories.find();
    res.send(categories);
}
);

router.post('/', async (req, res) => {
    let category = new Categories({
        Categoryname: req.body.Categoryname,
    });
    category = await category.save();

    if (!category) {
        return res.status(500).send('The category cannot be created');
    }

    res.send(category);
}
);









module.exports = router;
