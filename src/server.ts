import express from "express";
import fileupload from "express-fileupload";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

// ROUTES
import UserRoutes from "./routes/user.routes";
import AuthRoutes from "./auth/auth.routes";

class Server {
  public app: express.Application;
  public host: string = "localhost";
  public port: string = "3001";

  constructor() {
    /* Inicializacion esenciales como conexiones a la DB, routes, config middleware que se pueden hacer aparte (por prolijidad) */
    this.app = express();
    this.app.use(express.json({ limit: "200mb" }));
    this.app.use(fileupload());
    this.app.set("port", this.port);
    this.config();
    this.routes();
  }

  config() {
    /* Middleware y dependencias importantes de nuestra API */
    this.app.use(morgan("dev"));
    this.app.use(helmet());
    this.app.use(cors());
  }

  routes() {
    /* Las routes de nuestra API */
    this.app.use(AuthRoutes);
    this.app.use(UserRoutes);
  }

  start() {
    this.app.listen(this.app.get("port"), this.host, () => {
      console.log("Soy el server, estoy vivo!");
      console.log(`Estoy en el host/port: ${this.host}:${this.port}`);
    });
  }
}

// CREAMOS UN NUEVO OBJETO DE LA CLASE SERVER Y LO STATEAMOS
const server = new Server();
server.start();
