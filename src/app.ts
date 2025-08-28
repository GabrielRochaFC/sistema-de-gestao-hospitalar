import express, { Application, urlencoded } from "express";
import cors from "cors";
import helmet from "helmet";

const app: Application = express();

app.use(cors());
app.use(helmet());
app.use(urlencoded({ extended: true }));
app.use(express.json());

export { app };
