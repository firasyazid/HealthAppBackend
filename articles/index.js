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


const articlesRouter = require('./routes/articles');
const catRouter = require('./routes/categories');

   //routes
app.use(`${api}/articles`, articlesRouter);
app.use(`${api}/categories`, catRouter);
   

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

app.listen(3006, () => console.log('Listening on port 3006'));

module.exports = app;