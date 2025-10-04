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

## Project 13 Improvements!

Implement Authentication, Authorization, and Profile Management for WTWR API

### Overview

This pull request introduces full authentication and authorization functionality to the WTWR backend, refactors user-related controllers to use JWT-based authorization, and adds several key improvements for security, API structure, and maintainability.

### Authentication & Authorization

- Added JWT-based authorization middleware

- Implemented in middlewares/auth.js.

- Extracts Bearer tokens from request headers and verifies them using jsonwebtoken.

- Attaches the decoded payload to req.user for downstream controller access.

- Applied the middleware to all protected routes (e.g., clothing item updates and deletions).

- Removed temporary hardcoded user authorization logic from app.js.

- Created a login controller

- Added a login controller that authenticates users using bcrypt.

- Generates JWT tokens for successfully authenticated users.

- Added a new public /signin route in routes/index.js.

- Extended the User model

- Added email and password fields to userSchema.

- Enforced unique constraint and email validation with the validator npm package.

- Configured the password field with select: false to exclude hashes from query results.

### User Controllers

- Refactored createUser controller

- Implemented password hashing with bcrypt (10 salt rounds).

- Rewritten using async/await syntax for better readability and error handling.

- Updated routes to include a new POST /signup endpoint for user registration.

- Created updateProfile controller

- Allows users to update their name and avatar fields.

- Uses req.user to identify the authenticated user.

- Added authorization logic to deleteItem to ensure only owners can delete their items.

- Refactored getUserById → getCurrentUser

- Simplified by using req.user from the JWT payload.

- Ensures users can only access their own profile data.

### Middleware & Config Enhancements

- Added CORS support

### Centralized configuration

- Created utils/config.js with a temporary JWT secret key.

- Added reusable HTTP status constants (including FORBIDDEN) to utils/errors.js.

- Bug Fixes & Code Cleanup

- Fixed controller bugs for liking cards.

- Ensured protected routes correctly reference req.user.

- General refactoring for consistency and readability.

### Next Steps

Integrate this backend with the React frontend to complete the full-stack WTWR application.
