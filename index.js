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
// const verifyJWT = require("./middleware/vertifyJWT");
// const credentials = require("./middleware/credentials");
const corsOptions = require("./config/corsOptions");

dotenv.config();

const app = express();
const port = process.env.PORT;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.set("strictQuery", false);

// and fetch cookies credentials requirement
// app.use(credentials);

// Cross Origin Resource Sharing
// app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/users", userRouter);
app.use("/api/news", newsRouter);
app.use("/api/videos", videoRouter);
// app.use(verifyJWT);

connectDb.connectDb();
app.use(morgan("combined"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
