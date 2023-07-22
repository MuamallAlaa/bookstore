import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { router as UserRoutes } from "./routes/UserRroute";
import { router as BookRoutes } from "./routes/BookRoute";
import { router as CategoryRoute } from "./routes/CategoryRoute";

import cookieparser from "cookie-parser";

dotenv.config();
const app: Express = express();

// import { router as UserRoutes } from "./Routers/UserRoutes";
// import { router as InboxRoute } from "./Routers/inboxRoute";
app.use(express.json());
app.use(cookieparser());

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("hello world ");
});
app.listen(9090, () => console.log("the server start"));
app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/books", BookRoutes);
app.use("/api/v1/category", CategoryRoute);
