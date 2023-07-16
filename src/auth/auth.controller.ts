import { Request, Response } from "express";
import { isValidEmail, isValidPassword } from "./auth.utils";

const authLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (isValidEmail(email) && isValidPassword(password)) {
    console.log("MAIL Y PASSWORD VALIDO");
    res.status(200).json({
      status: "OK",
      code: 200,
    });
  } else {
    res.status(400).json({
      status: "BAD REQUEST",
      code: 400,
      message: "Invalid email or password.",
    });
  }

  return res;
};

const AuthController = {
  authLogin,
};

export default AuthController;
