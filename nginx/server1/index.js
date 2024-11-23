const express = require("express");
const app = express();

let count = 0;
const PORT = 3001;
app.get("/", (req, res) => {
  console.log(`Server1: ${count++}`);
  res.send("Server1");
});

app.listen(PORT, () => {
  console.log("Server1 is running on 3001");
});
