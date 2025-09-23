# WTWR (What to Wear?): Back End

This express app serves as the RESTful API for the WTWR project.
It powers the back end of the app handling user data. The API uses structured HTTP
endpoints for performing CRUD operations on clothing items and users.

A REST API (Representational State Transfer) is a design pattern for structuring
web services. It uses HTTP methods like GET, POST, PUT, PATCH, DELETE etc. to perform
operations on resources in the database.

## 🛠 Tech Stack

Framework: Express.js

Database: MongoDB + Mongoose

Architecture: REST API

Tools: Nodemon, ESLint

## Rest API and modular design

### RESTful Design Checklist

✅ HTTP methods represent intent (GET/POST/DELETE)

✅ Resource-based URLs (/items, /users)

✅ Stateless: no sessions or state saved across requests

✅ Modular design separating routes, logic, and models

### app.js – Main app entry point

- Initializes Express server

- Applies middleware (e.g. JSON parsing)

```js
app.use(express.json());
```

- Only requires the entry point for routers for both /items and /users paths.

```js
const indexRouter = require("./routes");
app.use("/", indexRouter);
```

### routes/

- Defines which HTTP routes exist and which controller handles each one.
- example from routes/clothingItems.js:

```js
//routes/clothingItems.js
router.get("/", getItems);
router.post("/", createItem);
router.delete("/:id", deleteItem);

//routes/index.js
const router = require("express").Router();

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

module.exports = router;
```

### models/

- Each model defines a MongoDB collection and validates schema fields using Mongoose(ODM)

```js
const mongoose = require("mongoose");

const validator = require("validator");

const clothingItemSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  weather: {
    required: true,
    type: String,
    enum: ["hot", "warm", "cold"],
  },
  imageUrl: {
    required: true,
    type: String,
    validate: {
      validator: (url) => validator.isURL(url),
      message: "This is an invalid url. Please try again.",
    },
  },
  owner: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "user",
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("clothingItem", clothingItemSchema);
```

### controllers/

- Each controller executes a specific operation using the Mongoose model.

```js
//controllers/clothingItems.js
const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};
```
