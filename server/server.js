const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();
const ApiRouter = require("./routes");
const { serverRestart } = require("./controllers/mail");

const app = express();
const port = process.env.PORT || 4000;

app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
);
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(morgan("dev"));
app.use(express.static("view"));

app.use("/api", ApiRouter);
app.get("*", (_, res) => {
  res.sendFile(path.resolve(__dirname, "view", "index.html"));
});

(() => {
  try {
    app.listen(port, () => {
      console.log(`DEBUG: Server listening on http://localhost:${port}`);
      serverRestart();
    });
  } catch (error) {
    console.error("ERROR: while starting server", error);
    process.exit(1);
  }
})()
