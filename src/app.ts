import express, { Application, urlencoded } from "express";
import cors from "cors";
import helmet from "helmet";
import { routes } from "./routes";
import { errorHandling } from "./middlewares/error-handling";

const app: Application = express();

app.use(cors());
app.use(helmet());
app.use(urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);
app.use(errorHandling);

export { app };
