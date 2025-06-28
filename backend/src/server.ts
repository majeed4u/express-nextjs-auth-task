import express from "express";
import routes from "./modules/index.routes";
import { env } from "./modules/helper/envVar";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./modules/auth";

const app = express();

app.use(
  cors({
    origin: ['http://192.168.3.11:3000', 'http://localhost:3000', 'http://localhost:3001'],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })
);



app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());


// Configure CORS middleware


app.use("/api", routes);

// middlewares

const port = env.PORT || 7000;

app.listen(port, () => {
  console.log(`Server running on port https://localhost:${port}`);
});
