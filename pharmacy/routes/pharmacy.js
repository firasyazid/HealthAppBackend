

const express = require('express');
const router = express.Router();
const {RegionPharmacy} = require('../models/region');
const {Pharmacy} = require('../models/pharmacy');

//Get all pharmacy by region 
  

router.get(`/`, async (req, res) =>{
    const pharmacyList = await Pharmacy.find().populate('region');
    if(!pharmacyList) {
        res.status(500).json({success: false})
    } 
    res.send(pharmacyList);
});


//postt 

router.post(`/:regionId`, async (req, res) => {

    const regionId = req.params.regionId;
    if(!regionId) return res.status(400).send('Invalid region');

 
    const region = await RegionPharmacy.findById(req.params.regionId);
    if(!region) return res.status(400).send('Invalid Region');


    let pharmacy = new Pharmacy({
        name: req.body.name,
        phone: req.body.phone,
        region: regionId,
    });
    pharmacy = await pharmacy.save();

    if(!pharmacy)
    return res.status(404).send('the pharmacy cannot be created!');
    res.send(pharmacy);

});




///get by region 
router.get(`/region/:id`, async (req, res) =>{
    const pharmacyList = await Pharmacy.find({region: req.params.id}).populate('region');
    if(!pharmacyList) {
        res.status(500).json({success: false})
    } 
    res.send(pharmacyList);
});

//get by id
router.get(`/:id`, async (req, res) =>{
    const pharmacy = await Pharmacy.findById(req.params.id).populate('region');
    if(!pharmacy) {
        res.status(500).json({success: false})
    } 
    res.send(pharmacy);
}
);



module.exports = router;

