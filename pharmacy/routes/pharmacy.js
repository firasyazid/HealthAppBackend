const express = require('express');
const router = express.Router();
const {RegionPharmacy} = require('../models/region');
const {Pharmacy} = require('../models/pharmacy');
const {Type} = require('../models/type');

//Get all pharmacy by region 
  
router.get(`/`, async (req, res) =>{
    const pharmacyList = await Pharmacy.find().populate('region type');
    if(!pharmacyList) {
        res.status(500).json({success: false})
    } 
    res.send(pharmacyList);
});


//postt 
router.post('/', async (req, res) => {
    

    let pharmacy = new Pharmacy({
        name: req.body.name,
        phone: req.body.phone,
        region: req.body.region,
        type: req.body.type,
        address: req.body.address,
        location: req.body.location
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
    const pharmacy = await Pharmacy.findById(req.params.id).populate('region type');
    if(!pharmacy) {
        res.status(500).json({success: false})
    } 
    res.send(pharmacy);
}
);



////a voirrrr

router.get('/pharmacies/:regionId/:typeId', async (req, res) => {
    try {
      const { regionId, typeId } = req.params;
  
      // Find pharmacies based on region and type IDs
      const pharmacies = await Pharmacy.find({ region: regionId, type: typeId });
  
      res.json(pharmacies);
    } catch (error) {
      console.error('Error fetching pharmacies:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

//delete
router.delete("/:id", async (req, res) => {
    try {
      const user = await Pharmacy.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'Pharmacy not found' });
      }
      res.status(200).json({ message: 'Pharmacy deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
  );


module.exports = router;

