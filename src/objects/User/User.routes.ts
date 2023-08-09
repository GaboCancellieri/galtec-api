import { Router, Request, Response } from "express";

const UserRoutes = Router();

UserRoutes.get("/user", (req: Request, res: Response) => {
  console.log("HOLA USUARIO!");
  return res.status(400).json({
    status: "BAD REQUEST",
    code: 400,
  });
});

export default UserRoutes;
