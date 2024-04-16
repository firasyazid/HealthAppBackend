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

router.delete("/:id", async (req, res) => {
    try {
      const user = await Categories.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'Categories not found' });
      }
      res.status(200).json({ message: 'Categories deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
  );







module.exports = router;
