const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
 const generatePassword = require('generate-password');
const nodemailer = require('nodemailer');
const multer = require("multer");
const twilio = require('twilio');
const accountSid = 'AC83373a6f6b1e962dea96476916a1cfb1';
const authToken = '1412262a1c371bb335303b7955ccc764';
const client = require('twilio')(accountSid, authToken);
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

router.post("/register", async (req, res) => {

  if (!req.body.password || req.body.password.trim() === '') {
    return res.status(400).send("Password is required");
  }
  
  let user = new User({
    fullname: req.body.fullname,
    email: req.body.email,  
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    isAdmin: req.body.isAdmin,
    phone: req.body.phone,
  });
  
  user = await user.save();

  if (!user) return res.status(400).send("the user cannot be created!");

  res.send(user);
}
);


router.get(`/`, async (req, res) => {
  const userList = await User.find().select("-passwordHash");

  if (!userList) {
    res.status(500).json({ success: false });
  } 
  res.send(userList);
}
);

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    const secret = process.env.secret;
    if (!user) {
      return res.status(400).send("User not found");
    }

    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
      const token = jwt.sign(
        {
          userId: user.id,
          isAdmin: user.isAdmin,

        },
        secret,
        { expiresIn: "1d" }
      );

      res.status(200).send({ user: user.email, userId: user.id, token: token , fullname: user.fullname});
    } else {
      res.status(400).send("Password is incorrect");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


///forgot password

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
       const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      const newPassword = generatePassword.generate({
        length: 8,  
        numbers: true, 
        strict: true,  
        uppercase: false

    });
    

       const passwordHash = bcrypt.hashSync(newPassword, 10);

       user.passwordHash = passwordHash;
      await user.save();

       const userTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "firasyazid4@gmail.com",
          pass: "cntnhhvujdsfzhig",

        },
      });

      const userMailOptions = {
        from: "firasyazid4@gmail.com",
        to: user.email,
        subject: "Password Reset",
        html: `
          <html>
            <body>
              <p>Bonjour,</p>
              <p>Your new password is: ${newPassword}</p>
             </body>
          </html>
        `,
      };
  
 
     await  userTransporter.sendMail(userMailOptions, function(error, info){
          if (error) {
              console.error(error);
              return res.status(500).json({ message: 'Failed to send email' });
          } else {
              console.log('Email sent: ' + info.response);
              return res.status(200).json({ message: 'Password reset successful. New password sent to the user.' });
          }
      });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});
 

  //get by id 

  

 
  
  //delete user by id 

  router.delete("/:id", async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
  );
    
  router.get('/total-users', async (req, res) => {
    try {
      const result = await User.aggregate([
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
  
  router.get("/:id", async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select("fullname email phone image");
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ fullname: user.fullname , email: user.email , phone: user.phone , image: user.image });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });




  router.put(
    "/:userId/update-image",
    uploadOptions.single("image"),
    async (req, res) => {
      try {
        const userId = req.params.userId;
        const file = req.file;
        const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { image: `${basePath}${file.filename}` },
          { new: true }
        );
  
        if (!updatedUser) {
          return res.status(404).send("User not found");
        }
        res.send(updatedUser);
      } catch (error) {
        console.error(error);
        res.status(500).send("Error updating user's image");
      }
    }
  );
  router.put('/phone/:id', async (req, res) => {
    const userId = req.params.id;
    const { phone } = req.body;

    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { phone },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.send(user);
    } catch (error) {
        res.status(400).send(error.message);
    }
});


/////number verification


router.post('/send-verification-code/:userId', async (req, res) => {
  const userId = req.params.userId;
  const { phoneNumber } = req.body;

  try {
       const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

       const message = await client.messages.create({
          body: 'Votre code de vérification est ' + verificationCode,
          from: '+17745045537',
          to: phoneNumber,
      });
       const user = await User.findByIdAndUpdate(
          userId,
          { verificationCode },
          { new: true, runValidators: true }
      );
      if (!user) {
          return res.status(404).send('User not found');
      }
      res.status(200).send('Verification code sent successfully');
  } catch (error) {
      console.error('Error sending verification code:', error);
      res.status(500).send('Internal server error');
  }
});


///// update number
router.put('/update-phone-number/:userId', async (req, res) => {
  const userId = req.params.userId;
  const { phoneNumber, verificationCode } = req.body;

  try {
     

      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).send('User not found');
      }

      if (user.verificationCode !== verificationCode) {
          return res.status(400).send('Invalid verification code');
      }

      user.phone = phoneNumber;
      user.verificationCode = null;  

      await user.save();

      res.status(200).send('Phone number updated successfully');
  } catch (error) {
      console.error('Error updating phone number:', error);
      res.status(500).send('Internal server error');
  }
});



/// update password

router.put('/update-password/:id', async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || oldPassword.trim() === '') {
    return res.status(400).send("Old password is required");
  }

  if (!newPassword || newPassword.trim() === '') {
    return res.status(400).send("New password is required");
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send("User not found");
    }

    const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).send("Old password is incorrect");
    }

    user.passwordHash = bcrypt.hashSync(newPassword, 10);
    await user.save();

    res.send("Password updated successfully");
  } catch (error) {
    res.status(500).send("Server error");
  }
});



module.exports = router;
