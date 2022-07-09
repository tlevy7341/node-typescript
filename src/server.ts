import { createServer } from "http";
import app from "./app";
import Logging from "./utils/logging";

createServer(app).listen(Number(process.env.SERVER_PORT), () => {
  Logging.info(`Server started on port ${process.env.SERVER_PORT}`);
});
