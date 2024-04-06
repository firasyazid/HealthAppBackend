const express = require("express");
const router = express.Router();
const { Speciality } = require("../models/speciality");
const { Medecin } = require("../models/medecin");
const multer = require("multer");
const axios = require('axios');
const { OpenAI } = require("openai");

const openai = new OpenAI({ apiKey: "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" });

 
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

//post medecin

router.post(
  "/:specialityId",
  uploadOptions.single("image"),
  async (req, res) => {
    const specialityId = req.params.specialityId;

    if (!specialityId)
      return res.status(400).send("Speciality ID missing in URL");

    const speciality = await Speciality.findById(specialityId);

    if (!speciality) return res.status(400).send("Invalid Speciality");

    const file = req.file;
    if (!file) return res.status(400).send("No image in the request");
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    let medecin = new Medecin({
      fullname: req.body.fullname,
      speciality: specialityId,
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

// get medecin by speciality

//need to display the medecin by speciality
//for example all the medecin with generaliste speciality

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

router.delete("/:id", (req, res) => {
  Medecin.findByIdAndRemove(req.params.id)
    .then((medecin) => {
      if (medecin) {
        return res

          .status(200)

          .json({ success: true, message: "the medecin is deleted!" });
      } else {
        return res

          .status(404)

          .json({ success: false, message: "medecin not found!" });
      }
    })

    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});


router.post('/drug-interactions', async (req, res) => {
  const { medication1, medication2 } = req.body;
  const prompt = `
      Interactions médicamenteuses entre ${medication1} et ${medication2} en deux phrases
  `;
  try {
      const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: 'system', content: 'Prompt', }, { role: 'user', content: prompt, },],
          max_tokens: 150,
          temperature: 0.7,
      });

      if (response && response.choices && response.choices.length > 0) {
          res.status(200).json({ response: response.choices[0].message['content'] });
      } else {
          res.status(500).json({ message: "No valid response from the API" });
      }
  } catch (error) {
      console.error('Error creating completion:', error);
      res.status(500).json({ message: "An error occurred" });
  }
});



 

module.exports = router;
