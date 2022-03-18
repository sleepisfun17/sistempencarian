const express = require("express");
const app = express();
const port = 3000;

//use ejs
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", {
    title: "Sopipi Tuhandred Aikyu",
  });
  // console.log(req.body.search);
});

app.post("/", (req, res) => {
  // const search = document.getElementById("search").value;
  console.log(req.body.search);
});

app.get("/result", (req, res) => {
  res.render("result", { title: "Hasil Pencarian" });
});

app.listen(port, () => {
  console.log(`Sistem Pencarian is listening on port ${port}`);
});
