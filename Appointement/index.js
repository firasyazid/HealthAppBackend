const express = require ('express');
const app = express();
require("dotenv/config");
const mongoose = require("mongoose");
const morgan = require('morgan');
 const cors = require("cors");

const api = process.env.API_URL;

//middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());
 


//routers

const appRouter = require('./routes/Appointement');
 //routes

app.use(`${api}/appointement`, appRouter);
 






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

app.listen(3005, () => console.log('Listening on port 3005'));

module.exports = app;