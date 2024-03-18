
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

    let region = new RegionPharmacy({
        name: req.body.name,
    });
    region = await region.save();

    if(!region)
    return res.status(404).send('the region cannot be created!');

    res.send(region);
});

module.exports = router;

