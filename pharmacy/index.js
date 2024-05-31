const express = require ('express');
const app = express();
require("dotenv/config");
const mongoose = require("mongoose");
const morgan = require('morgan');
const api = process.env.API_URL;
const cors = require("cors");
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
const serverUtils = require('./server');

//middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());
app.options("*", cors());
 
//routers


const pharmacyRouter = require('./routes/pharmacy');
const regionRouter = require('./routes/region');
const typeRouter = require('./routes/type');
 
//routes
app.use(`${api}/pharmacy`, pharmacyRouter);
app.use(`${api}/RegionPharmacy`, regionRouter);
app.use(`${api}/type`, typeRouter);

    

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

let server;

const port = process.env.PORT || 3007;
 serverUtils.startServer(app, port);


module.exports = app;