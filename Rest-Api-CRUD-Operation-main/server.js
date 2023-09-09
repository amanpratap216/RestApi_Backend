import express from "express";
const app = express();
import { APP_PORT, DB_URL } from "./config";
import errorHandler from "./middlewares/errorHandler";
import routes from "./routes";
import path from "path";
import mongoose from "mongoose";

mongoose.connect(DB_URL);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("DB_CONNECTED");
});

//app.post();
global.appRoot = path.resolve(__dirname);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/api", routes);

app.use("/uploads", express.static("uploads"));
app.use(errorHandler);
app.listen(APP_PORT, () => console.log("port is running on" + APP_PORT));
