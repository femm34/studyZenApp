const express = require("express");
const port = 3000;
const app = express();
const base = require("./config/database");
const session = require("express-session");

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use("/", require("./routes/router"));
// app.use("/register", require("./routes/router"));
// app.use("/cards", require("./routes/router"));
// app.use("/login", require("./routes/router"));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
