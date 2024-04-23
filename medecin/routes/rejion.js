require("dotenv/config");
const api = process.env.apiKey;

const express = require("express");
const router = express.Router();
const { Region } = require("../models/region");
const { OpenAI } = require("openai");

const openai = new OpenAI({ apiKey: api });

router.post(
  "/drug-interactions/:medication1/:medication2",
  async (req, res) => {
    const { medication1, medication2 } = req.params;
    const prompt = `
        Interactions médicamenteuses entre ${medication1} et ${medication2} en deux phrases. si ce sont pas de medicaments dis moi.`;
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Prompt" },
          { role: "user", content: prompt },
        ],
        max_tokens: 150,
        temperature: 0.7,
      });
      if (response && response.choices && response.choices.length > 0) {
        const responseData = {
          response: response.choices[0].message["content"],
        };
        res.status(200).json(responseData);
      } else {
        res.status(500).json({ message: "No valid response from the API" });
      }
    } catch (error) {
      console.error("Error creating completion:", error);
      res.status(500).json({ message: "An error occurred" });
    }
  }
);

//Get all region

router.get(`/`, async (req, res) => {
  const regionList = await Region.find();
  if (!regionList) {
    res.status(500).json({ success: false });
  }
  res.send(regionList);
});

//post

router.post(`/`, async (req, res) => {
  let region = new Region({
    name: req.body.name,
  });
  region = await region.save();

  if (!region) return res.status(404).send("the region cannot be created!");

  res.send(region);
});

module.exports = router;
