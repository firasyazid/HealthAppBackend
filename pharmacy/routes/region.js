
const express = require('express');
const router = express.Router();
const {RegionPharmacy} = require('../models/region');

//Get all region

router.get(`/`, async (req, res) =>{
    const regionList = await RegionPharmacy.find();
    if(!regionList) {
        res.status(500).json({success: false})
    } 
    res.send(regionList);
});


//post
router.post(`/`, async (req, res) => {
  if (!req.body.name) {
      return res.status(404).send('Name is required for creating a region.');
  }

  let region = new RegionPharmacy({
      name: req.body.name,
  });
  region = await region.save();

  if (!region) {
      return res.status(404).send('The region cannot be created!');
  }

  res.send(region);
});

router.delete("/:id", async (req, res) => {
    try {
      const user = await RegionPharmacy.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'RegionPharmacy not found' });
      }
      res.status(200).json({ message: 'RegionPharmacy deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
  );
module.exports = router;

