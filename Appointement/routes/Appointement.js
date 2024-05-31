const axios = require("axios");
const { Appointment } = require("../models/appointement");
const express = require("express");
const router = express.Router();

const usersUri = "http://192.168.1.18:3003/api/v1/users/";
const doctorsUri = "http://192.168.1.18:3004/api/v1/medecin/";

router.post("/", async (req, res) => {
  try {
    const { user_id, doctor_id, date, AppHour } = req.body;
    const existingAppointment = await Appointment.findOne({
      doctor_id,
      date,
      "AppHour.day": AppHour.day,
      "AppHour.hours": { $in: AppHour.hours },
    });
    if (existingAppointment) {
      return res
        .status(400)
        .json({
          msg: "Appointment already exists for this doctor at this time",
        });
    }

    const usersResponse = await axios.get(usersUri);
    const users = usersResponse.data;
    const user = users.find((user) => user._id === user_id);
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const doctorsResponse = await axios.get(doctorsUri);
    const doctors = doctorsResponse.data;
    const doctor = doctors.find((doctor) => doctor._id === doctor_id);
    if (!doctor) {
      return res.status(400).json({ msg: "Doctor not found" });
    }

     const newAppointment = new Appointment({
      user_id,
      doctor_id,
      date,
      userName: user.fullname,
      doctorName: doctor.fullname,
      AppHour,
    });
    const savedAppointment = await newAppointment.save();

    res.status(201).json(savedAppointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

///get all appointments

router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find() 
     ;
     const modifiedAppointments = appointments.map(appointment => {
      return {
        ...appointment._doc,
        userName: appointment.user_id.fullname, // Assuming 'userName' corresponds to 'fullname' of the user
      };
    });
    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//delete appointment by id
router.delete("/:id", async (req, res) => {
  try {
    const appointmentId = req.params.id;

    const appointment = await Appointment.findByIdAndDelete(appointmentId);
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found!" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Appointment deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});


router.get("/confirmed", async (req, res) => {
  try {
    const confirmedAppointments = await Appointment.find({ status: "confirmed" });
    res.status(200).json(confirmedAppointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.get("/canceled", async (req, res) => {
  try {
    const confirmedAppointments = await Appointment.find({ status: "cancelled" });
    res.status(200).json(confirmedAppointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/:id/update-status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.status = status;
    await appointment.save();

    res.status(200).json(appointment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});
 
router.get('/appointments-by-month', async (req, res) => {
  try {
    const result = await Appointment.aggregate([
      {
        $project: {
          month: { $arrayElemAt: [{ $split: ["$date", "/"] }, 1] },
          year: { $arrayElemAt: [{ $split: ["$date", "/"] }, 2] }
        }
      },
      {
        $group: {
          _id: { month: "$month", year: "$year" },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      },
      {
        $project: {
          _id: 0,
          month: {
            $concat: [
              { $switch: {
                  branches: [
                    { case: { $eq: ["$_id.month", "01"] }, then: "January" },
                    { case: { $eq: ["$_id.month", "02"] }, then: "February" },
                    { case: { $eq: ["$_id.month", "03"] }, then: "March" },
                    { case: { $eq: ["$_id.month", "04"] }, then: "April" },
                    { case: { $eq: ["$_id.month", "05"] }, then: "May" },
                    { case: { $eq: ["$_id.month", "06"] }, then: "June" },
                    { case: { $eq: ["$_id.month", "07"] }, then: "July" },
                    { case: { $eq: ["$_id.month", "08"] }, then: "August" },
                    { case: { $eq: ["$_id.month", "09"] }, then: "September" },
                    { case: { $eq: ["$_id.month", "10"] }, then: "October" },
                    { case: { $eq: ["$_id.month", "11"] }, then: "November" },
                    { case: { $eq: ["$_id.month", "12"] }, then: "December" }
                  ],
                  default: "Unknown"
                }
              },
              ": ",
              { $toString: "$count" }, // Convert count to string
              " appointments"
            ]
          }
        }
      }
    ]);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.get('/total-appointments', async (req, res) => {
  try {
    const result = await Appointment.aggregate([
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

 

module.exports = router;
