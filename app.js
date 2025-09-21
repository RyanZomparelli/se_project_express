//external imports
//Web framework for Node.js
const express = require("express");
//ODM (Object Document Mapper) provides schema validation and DB operations.
//Note relational data bases would use a ORM (Object Relational Mapper).
const mongoose = require("mongoose");

//internal imports
const indexRouter = require("./routes");

//Creating an 'instance' of an express app.
const app = express();

/*Connecting my express server to the data base. Note MongoDB uses 'lazy creation'
and won't technically create the database until I save a document on it.
127.0.0.1 is the same as localhost but works universally on all computers.*/
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  //mongoose.connect returns a promise so we can add a notification when it connects
  //or an error if there's a problem.
  .then(() => console.log("Connected to MongoDB"))
  .catch((e) => {
    console.error(e);
  });

//Temporary middleware for user authorization to create clothingItems.
app.use((req, res, next) => {
  req.user = {
    _id: "68ce00577cab308d9b75df8a",
  };
  next();
});

//Place this middleware before routes
//Middleware to parse JSON from client when creating resources
app.use(express.json());
//Middleware to parse Content-Type: application/x-www-form-urlencoded (HTML form)
app.use(express.urlencoded({ extended: true })); //Technically don't need this middleware for this app

//Entry point for routes. Otherwise I'd have to require all different routes here
//like userRoutes and clothingItemRoutes ect.
app.use("/", indexRouter);

//Creating an environment variable for port with a default port to run the server on.
const { PORT = 3001 } = process.env;

//Creating the server and listening for requests on the environment port.
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
