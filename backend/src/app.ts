import express from "express";
import routes from "./routes";
import { errorHandler } from "./common/middlewares/errorHandler";
import cors from "cors";

export const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));


app.use(express.json());

// routes
app.use("/api", routes);

// error handler – LUÔN CUỐI
app.use(errorHandler);
