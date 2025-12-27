import express from "express";
import routes from "./routes";
import { errorHandler } from "./common/middlewares/errorHandler";

export const app = express();

app.use(express.json());

// routes
app.use("/api", routes);

// error handler – LUÔN CUỐI
app.use(errorHandler);
