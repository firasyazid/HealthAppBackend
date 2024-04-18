const express = require ('express');
const app = express();
require("dotenv/config");
const mongoose = require("mongoose");
const morgan = require('morgan');
const cors = require("cors");
const authJwt = require('./helpers/jwt');

 
const api = process.env.API_URL;

//middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());
app.use(authJwt());
  


//routers
const userRouter = require("./routes/user");
//routes
app.use(`${api}/users`, userRouter);







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

app.listen(3003, () => console.log('Listening on port 3003'));

module.exports = app;