const express = require ('express');
const app = express();
require("dotenv/config");
const mongoose = require("mongoose");
const morgan = require('morgan');
const api = process.env.API_URL;
const cors = require("cors");
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

//middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());
app.options("*", cors());
 
//routers


const pharmacyRouter = require('./routes/pharmacy');
const regionRouter = require('./routes/region');
 
//routes
app.use(`${api}/pharmacy`, pharmacyRouter);
app.use(`${api}/RegionPharmacy`, regionRouter);
    

//Database
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "Health_App",
  })
  .then(() => {
    console.log("Database Connection is ready...");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(3007, () => console.log('Listening on port 3007'));

module.exports = app;