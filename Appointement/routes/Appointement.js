 const axios = require('axios');
 const {Appointment} = require('../models/appointement');
const express = require("express");
const router = express.Router();
 
 const usersUri = 'http://192.168.100.221:3003/api/v1/users/';
const doctorsUri = 'http://192.168.100.221:3004/api/v1/medecin/';

 
router.post('/', async (req, res) => {
    try {
        const { user_id, doctor_id, date, AppHour } = req.body;
  
        const existingAppointment = await Appointment.findOne({ doctor_id, date, "AppHour.day": AppHour.day, "AppHour.hours": { $in: AppHour.hours } });
        if (existingAppointment) {
            return res.status(400).json({ msg: 'Appointment already exists for this doctor at this time' });
        }
        
        const usersResponse = await axios.get(usersUri);
      const users = usersResponse.data;
      const user = users.find(user => user._id === user_id);
      if (!user) {
        return res.status(400).json({ msg: 'User not found' });
      }
  
      const doctorsResponse = await axios.get(doctorsUri);
      const doctors = doctorsResponse.data;
      const doctor = doctors.find(doctor => doctor._id === doctor_id);
      if (!doctor) {
        return res.status(400).json({ msg: 'Doctor not found' });
      }
  
      // Crée le rendez-vous avec le nom complet de l'utilisateur et du médecin
      const newAppointment = new Appointment({ 
        user_id, 
        doctor_id, 
        date,
        userName: user.fullname,
        doctorName: doctor.fullname,
        AppHour
      });
      const savedAppointment = await newAppointment.save();
  
      res.status(201).json(savedAppointment);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });



  ///get all appointments

   router.get('/', async (req, res) => {
    try {
      const appointments = await Appointment.find();
      res.json(appointments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
    }
    );

    //delete appointment by id
    router.delete("/:id", async (req, res) => {
        try {
          const appointmentId = req.params.id;
      
          const appointment = await Appointment.findByIdAndDelete(appointmentId);
          if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found!" });
          }
      
          return res.status(200).json({ success: true, message: "Appointment deleted successfully" });
        } catch (err) {
          console.error(err.message);
          res.status(500).json({ success: false, error: err.message });
        }
      });
      
      

module.exports = router;
