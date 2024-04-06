
const express = require('express');
const router = express.Router();
const {Type} = require('../models/type');


//Get all type
router.get(`/`, async (req, res) =>{
    const typeList = await Type.find();
    if(!typeList) {
        res.status(500).json({success: false})
    } 
    res.send(typeList);
});


//postt

 //post
router.post(`/`, async (req, res) => {

    let type = new Type({
        name: req.body.name,
    });
    type = await type.save();

    if(!type)
    return res.status(404).send('the type cannot be created!');

    res.send(type);
});
 

//get by id

router.get(`/:id`, async (req, res) =>{
    const type = await Type.findById(req.params.id);
    if(!type) {
        res.status(500).json({success: false})
    } 
    res.send(type);
}
);


module.exports = router;
