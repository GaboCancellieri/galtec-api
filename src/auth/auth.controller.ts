import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import { findUser, isValidEmail, isValidPassword } from "./auth.utils";
import { compare } from "bcrypt";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "./auth.constants";
import RefreshToken from "../objects/RefreshToken/RefreshToken.schema";

const authLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  /*  - CHECK EMAIL & PASSWORD -
    [  NO(esEmailValido(email)) OR NO(esPasswordValida(password)) ]
  */
  if (!isValidEmail(email) || !isValidPassword(password)) {
    return res.status(400).json({
      status: "BAD REQUEST",
      code: 400,
      message: "Invalid email or password.",
    });
  }

  // 1. IR A LA DB A BUSCAR EL USUARIO PORQUE TIENE QUE ESTAR REGISTRADO!!
  const user = await findUser(email);
  if (!user) {
    return res.status(404).json({
      status: "BAD REQUEST",
      code: 404,
      message: "User not found!",
    });
  }

  // 2. VALIDAR PASSWORD INGRESADA --> decrypt(user.password) === password
  const isMatchedPassword = await compare(password, user.password);
  if (!isMatchedPassword) {
    return res.status(400).json({
      status: "BAD REQUEST",
      code: 400,
      message: "Invalid email or password.",
    });
  }

  // 3. CREAR DATOS DEL USUARIO ENCRIPTADOS EN EL TOKEN
  const userToken = {
    username: user.username,
    email: user.email,
    DOB: user.DOB,
    isVerified: user.isVerified,
    isOnRevision: user.isOnRevision,
    isBanned: user.isBanned,
  };

  // 4. CREAR ACCESS TOKEN.
  const accessToken = await sign(userToken, ACCESS_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  // 5. CREAR REFRESH TOKEN.
  const refreshToken = await sign(userToken, REFRESH_TOKEN_SECRET);

  // 6. GUARDAR REFRESH TOKEN EN DB.
  new RefreshToken({ token: refreshToken }).save();

  return res.status(200).json({
    status: "OK",
    code: 200,
    accessToken,
    refreshToken,
  });
};

const AuthController = {
  authLogin,
};

export default AuthController;
