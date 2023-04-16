require("express-async-errors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
// security packages
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");

const app = express();
dotenv.config();
mongoose.set("strictQuery", true);

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 1000 * 60 * 15, // 15 minutes 
    max: 60,
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize())

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

const authRouter = require("./routes/auth-routes");
const userRouter = require("./routes/user-routes");
const notFound = require("./middleware/not-found");
const errorHandler = require("./middleware/error-handler");

const port = process.env.PORT || 5100;

// Activate morgan
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use(errorHandler);
app.use(notFound);

const start = async () => {
  try {
    await mongoose
      .connect(process.env.MONGODB_URL)
      .then(() => console.log("MONGODB CONNECTED!"))
      .catch((err) => console.log(err));

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
};
start();
