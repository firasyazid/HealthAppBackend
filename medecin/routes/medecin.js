const express = require("express");
const router = express.Router();
const { Speciality } = require("../models/speciality");
const { Medecin } = require("../models/medecin");
const multer = require("multer");
const axios = require('axios');
 
 
 
const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype] || "file";
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });




router.get('/total-medecin', async (req, res) => {
  try {
    const result = await Medecin.aggregate([
      {
        $group: {
          _id: null,
          count: { $sum: 1 }
        }
      }
    ]);

    if (result.length > 0) {
      res.json({ count: result[0].count });
    } else {
      res.json({ count: 0 });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});












//post medecin

router.post(
  "/",
  uploadOptions.single("image"),
  async (req, res) => {
 
    const file = req.file;
    if (!file) return res.status(400).send("No image in the request");
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    let medecin = new Medecin({
      fullname: req.body.fullname,
      description: req.body.description,
      speciality: req.body.speciality,
      address: req.body.address,
      phone: req.body.phone,
      image: `${basePath}${file.filename}`,
      region: req.body.region,
      
    });
    medecin = await medecin.save();

    if (!medecin) return res.status(500).send("The medecin cannot be created");

    res.send(medecin);
  }
);

//Get all medecin

router.get(`/`, async (req, res) => {
  const medecinList = await Medecin.find().populate("speciality");
  if (!medecinList) {
    res.status(500).json({ success: false });
  }
  res.send(medecinList);
});

router.get(`/:id`, async (req, res) => {
  const medecin = await Medecin.findById(req.params.id).populate("speciality");

  if (!medecin) {
    res
      .status(500)
      .json({ message: "The medecin with the given ID was not found." });
  }
  res.status(200).send(medecin);
});

 
router.get("/by-category/:specialityId", async (req, res) => {
  const { specialityId } = req.params;
  try {
    const medecins = await Medecin.find({ speciality: specialityId });
    res.json(medecins);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const user = await Medecin.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Medecin not found' });
    }
    res.status(200).json({ message: 'Medecin deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}
);






 

module.exports = router;
