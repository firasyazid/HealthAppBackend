const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
 const generatePassword = require('generate-password');
const nodemailer = require('nodemailer');
 
  

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
      const user = await User.findById(req.params.id).select("fullname");
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ fullname: user.fullname });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;
