import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectLocalDB, connectOnlineDB } from "./db/db.js";
import users from "./routes/users.js";

//import users from "./routes/users.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/users", users);
//app.use("/api/data", data);

connectLocalDB();
//connectOnlineDB();


app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.post("/",(req,res) => {
  const body = req.body;
  res.status(201).json({
    message: "Hello there",
    data: body
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})