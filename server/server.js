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
const environment = process.env.NODE_ENV || "development";

app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
);
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

environment === "production" && (() => {
  app.use(express.static("view"));
  app.use(morgan("tiny"));
  console.log("DEBUG: Server running in production mode");
})();

environment === "development" && (() => {
  const cors = require("cors");
  app.use(cors({ origin: "http://localhost:3000", credentials: true }));
  app.use(morgan("dev"));
})();

app.use("/api", ApiRouter);

app.get("*", (_, res) => {
  if (environment === "development")
    return res.redirect("http://localhost:3000");
  else if (environment === "production")
    return res.sendFile(path.resolve(__dirname, "view", "index.html"));
  else
    return res.status(404).json({ success: false, message: "Page not found" });
});

(() => {
  try {
    app.listen(port, () => {
      console.log(`DEBUG: Server listening on http://localhost:${port} in ${environment} mode`);
      // serverRestart();
    });
  } catch (error) {
    console.error("ERROR: while starting server", error);
    process.exit(1);
  }
})()
