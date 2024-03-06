const express = require("express");
const router = express.Router();
const { Speciality } = require("../models/speciality");
const multer = require("multer");
  const { Medecin } = require("../models/medecin");

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

//Get all Speciality
router.get(`/`, async (req, res) => {
  const categoryList = await Speciality.find();
  if (!categoryList) {
    res.status(500).json({ success: false });
  }
  res.send(categoryList);
});

//post
router.post(
  "/",
  uploadOptions.fields([{ name: "icon", maxCount: 1, optional: true }]),
  async (req, res) => {
    const files = req.files;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    let image1Url = "";
    if (files["icon"]) {
      const icon = files["icon"][0];
      image1Url = `${basePath}${icon.filename}`;
    }

    let category = new Speciality({
      titre: req.body.titre,
      description: req.body.description,
      icon: image1Url,
    });

    category = await category.save();

    if (!category) {
      return res.status(404).send("the Speciality cannot be created!");
    }
    res.send(category);
  }
);


router.delete("/:id", (req, res) => {
  Speciality.findByIdAndDelete(req.params.id)
    .then((speciality) => {
      if (speciality) {
        return res
          .status(200)
          .json({ success: true, message: "The speciality is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Speciality not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

router.get('/categories/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const medecins = await Medecin.find({ speciality: categoryId });
    if (!medecins) {
      return res.status(404).json({ success: false, message: 'No medecins found for this category.' });
    }
    res.header('categoryId', categoryId).json({ success: true, medecins });
  } catch (error) {
    console.error('Error fetching medecins:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
