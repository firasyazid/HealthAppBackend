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
const speciality = require("./routes/speciality");
const medecin = require("./routes/medecin");
const region = require("./routes/rejion");
  //routes
app.use(`${api}/speciality`, speciality);
app.use(`${api}/medecin`, medecin);
app.use(`${api}/region`, region);
  






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

app.listen(3004, () => console.log('Listening on port 3004'));

module.exports = app;