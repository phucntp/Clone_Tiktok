const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
// eslint-disable-next-line import/no-extraneous-dependencies
const bodyParser = require("body-parser");
const connectDb = require("./config/db.js");
const userRouter = require("./routes/userRoutes");
const newsRouter = require("./routes/newsRoutes");
const videoRouter = require("./routes/videoRoutes");
const imageRouter = require("./routes/imageRoutes");
const musicRouter = require("./routes/musicRoutes");
const tagRouter = require("./routes/tagRouter");

const verifyJWT = require("./middleware/vertifyJWT");
const credentials = require("./middleware/credentials");
const corsOptions = require("./config/corsOptions");

dotenv.config();

const app = express();
const port = process.env.PORT;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.set("strictQuery", false);

// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
// app.use(cors(corsOptions));
app.use(function (req, res, next) {
  // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Origin",
    "https://clone-tiktok-fe-git-master-phucntp.vercel.app"
  );
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
//
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/users", userRouter);
app.use("/api/news", newsRouter);
app.use("/api/videos", videoRouter);
app.use("/api/images", imageRouter);
app.use("/api/musics", musicRouter);
app.use("/api/tags", tagRouter);
app.use(verifyJWT);

connectDb.connectDb();
app.use(morgan("combined"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
