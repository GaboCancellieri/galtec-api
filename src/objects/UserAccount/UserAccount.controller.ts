import { Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";
import { findUser, getTokenExpirationInSeconds } from "./UserAccount.utils";
import { compare } from "bcrypt";
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} from "./UserAccount.constants";
import RefreshToken from "../RefreshToken/RefreshToken.schema";
import { IUserAccount } from "../UserAccount/UserAccount.types";
import {
  checkIsAdult,
  checkIsValidEmail,
  checkIsValidPassword,
  randomString,
} from "../../utils/validators";
import UserAccount from "../UserAccount/UserAccount.schema";
import {
  MISSING_REQUIRED_FIELDS_ERROR,
  SERVER_ERROR_RESPONSE,
  SUCCESSFUL_RESPONSE_WITH_DATA,
} from "../../constants/Responses";
import { hash } from "bcrypt";
import {
  USER_VERIFICATION_EMAIL,
  USER_VERIFICATION_EMAIL_TITLE,
} from "../../constants/email";
import { sendEmail } from "../../utils/email";
import { IRefreshToken } from "../RefreshToken/RefreshToken.types";

const saltRounds = 10;

/**
 * @api {post} /userAccount/register Register User
 * @apiVersion 1.0.0
 * @apiName RegisterUser
 * @apiGroup UserAccount
 * @apiParam {String} username User's desired username.
 * @apiParam {String} password User's password.
 * @apiParam {String} email User's email address.
 * @apiParam {Date} DOB User's email address.
 * @apiSuccess {String} message Successful registration message.
 */
const userRegister = async (req: Request, res: Response) => {
  try {
    const { username, email, password, DOB } = req.body;
    /*  - CHECK EMAIL & PASSWORD -
    [  NO(esEmailValido(email)) OR NO(esPasswordValida(password)) ]
  */
    if (!checkIsValidEmail(email) || !checkIsValidPassword(password)) {
      return res.status(400).json({
        status: "BAD REQUEST",
        code: 400,
        message: "Invalid email or password values.",
      });
    }

    // 1. CHECKEAMOS QUE NO HAYA UN USUARIO CREADO CON ESE USERNAME O EMAIL
    const user = await UserAccount.findOne({
      $or: [
        {
          username: username,
        },
        {
          email: email,
        },
      ],
    });
    if (user) {
      return res.status(400).json({
        status: "BAD REQUEST",
        code: 409,
        message: "Username or email already in use.",
      });
    }

    // 2. ENCRIPTAR LA PASSWORD CON BCRYPT
    const code = randomString(10, "#aA");
    const codeHash = await hash(code, saltRounds);
    const passwordHash = await hash(password, saltRounds);

    // 3. CREAR EL NUEVO USUARIO EN LA DB
    new UserAccount({
      username,
      email,
      DOB,
      password: passwordHash,
      verifCode: codeHash,
    }).save();

    // 4. ENVIAMOS EL MAIL CON EL CODIGO DE VERIFICACIÓN
    const contentEmail = USER_VERIFICATION_EMAIL(username, code);
    sendEmail(email, USER_VERIFICATION_EMAIL_TITLE, contentEmail);

    return res.status(201).json(
      SUCCESSFUL_RESPONSE_WITH_DATA({
        message: `User ${email} created successfully.`,
      })
    );
  } catch (error) {
    return res.status(500).json(SERVER_ERROR_RESPONSE(error));
  }
};

/**
 * @api {post} /userAccount/login Login User
 * @apiVersion 1.0.0
 * @apiName LoginUser
 * @apiGroup UserAccount
 * @apiParam {String} username User's username.
 * @apiParam {String} password User's password.
 * @apiSuccess {String} token User's authentication token.
 */
const userLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  /*  - CHECK EMAIL & PASSWORD -
    [  NO(esEmailValido(email)) OR NO(esPasswordValida(password)) ]
  */
  if (!checkIsValidEmail(email) || !checkIsValidPassword(password)) {
    return res.status(400).json({
      status: "BAD REQUEST",
      code: 400,
      message: "Invalid email or password.",
    });
  }

  // 1. IR A LA DB A BUSCAR EL USUARIO PORQUE TIENE QUE ESTAR REGISTRADO!!
  const user: IUserAccount | null = await findUser(email);
  if (!user) {
    return res.status(404).json({
      status: "BAD REQUEST",
      code: 404,
      message: "User doesn't exist!",
    });
  }

  // 2. VALIDAR PASSWORD INGRESADA --> user.password === password
  const isMatchedPassword = await compare(password, user.password);
  if (!isMatchedPassword) {
    return res.status(400).json({
      status: "BAD REQUEST",
      code: 400,
      message: "Invalid email or password.",
    });
  }

  // DE PASO CHECKEAMOS SI EL USUARIO ES ADULTO Y SI YA PUEDE VER CONTENIDO EXPLICITO.
  const userEnableExplicitContent = checkIsAdult(user.DOB);
  if (userEnableExplicitContent !== user.enableExplicitContent) {
    UserAccount.findByIdAndUpdate(user.id, {
      enableExplicitContent: userEnableExplicitContent,
    });
  }

  // 3. CREAR DATOS DEL USUARIO ENCRIPTADOS EN EL TOKEN
  const userToken = {
    id: user.id,
    email: user.email,
    status: user.status,
    enableExplicitContent: userEnableExplicitContent,
  };

  // 4. CREAR ACCESS TOKEN.
  const expiresIn = getTokenExpirationInSeconds();
  const accessToken = await sign(userToken, ACCESS_TOKEN_SECRET, {
    expiresIn,
  });

  // 5. CREAR REFRESH TOKEN.
  const refreshToken = await sign(userToken, REFRESH_TOKEN_SECRET);

  // 6. GUARDAR REFRESH TOKEN EN DB.
  await new RefreshToken({ token: refreshToken }).save();

  return res.status(200).json({
    status: "OK",
    code: 200,
    accessToken,
    refreshToken,
  });
};

/**
 * @api {post} /userAccount/logout Logout User
 * @apiVersion 1.0.0
 * @apiName LogoutUser
 * @apiGroup UserAccount
 * @apiSuccess {String} message Logout success message.
 */
const userLogout = (req: Request, res: Response) => {
  try {
    // VALIDAMOS QUE VENGA UN REFRESH TOKEN
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(400).json(MISSING_REQUIRED_FIELDS_ERROR);

    // INVALIDAMOS EL TOKEN ELIMINANDOLO DE LA DB
    const oldRefreshToken = authHeader.split(" ")[1];
    if (!oldRefreshToken || !ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET)
      return res.status(400).json(MISSING_REQUIRED_FIELDS_ERROR);

    RefreshToken.findOneAndDelete({ token: oldRefreshToken });

    // Return response indicating successful logout
    return res.status(200).json(
      SUCCESSFUL_RESPONSE_WITH_DATA({
        message: `User logout successful.`,
      })
    );
  } catch (error) {
    return res.status(500).json(SERVER_ERROR_RESPONSE(error));
  }
};

/**
 * @api {post} /userAccount/refresh Refresh User Token
 * @apiVersion 1.0.0
 * @apiName UserRefresh
 * @apiGroup UserAccount
 * @apiHeader {String} refreshToken User's refresh token.
 * @apiSuccess {{ accessToken: string, refreshToken: string}} Two new tokens generated for authentication.
 * @apiError {String} message Error message indicating reason for token refresh failure.
 */
const userRefresh = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(400).json(MISSING_REQUIRED_FIELDS_ERROR);

    // 1. OBTENEMOS EL REFRESH TOKEN DEL HEADER.
    const oldRefreshToken = authHeader.split(" ")[1];

    if (!oldRefreshToken || !ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET)
      return res.status(400).json(MISSING_REQUIRED_FIELDS_ERROR);

    // 2. VERIFICAMOS QUE EL REFRESH TOKEN SEA CORRECTO.
    const user: any = await verify(oldRefreshToken, REFRESH_TOKEN_SECRET);

    // 3. ELIMINAMOS EL TOKEN VIEJO DE LA DB.
    const token: IRefreshToken | null = await RefreshToken.findOne({
      token: oldRefreshToken,
    });
    if (!token) return res.status(400).json(MISSING_REQUIRED_FIELDS_ERROR);
    const deleteResult = await RefreshToken.findByIdAndDelete(token.id);

    // 4. CREAR ACCESS TOKEN.
    const expiresIn = getTokenExpirationInSeconds();
    const accessToken = await sign(user, ACCESS_TOKEN_SECRET, {
      expiresIn,
    });

    // 5. CREAR REFRESH TOKEN.
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      status: user.status,
    };
    const refreshToken = await sign(tokenPayload, REFRESH_TOKEN_SECRET);

    // 6. GUARDAMOS NUEVO REFRESH TOKEN EN LA DB
    const newRefreshToken = new RefreshToken({
      token: refreshToken,
    });
    await newRefreshToken.save();

    return res.status(200).json({ accessToken, refreshToken });
  } catch (error: any) {
    return res.status(500).json(SERVER_ERROR_RESPONSE(error));
  }
};

/**
 * @api {post} /userAccount/verify-email Verify User Email
 * @apiVersion 1.0.0
 * @apiName VerifyEmail
 * @apiGroup User
 * @apiParam {String} user's email.
 * @apiParam {String} code Verification code sent to email.
 * @apiSuccess {String} message Email verification success message.
 */
const userVerifyEmail = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;
    const user = await UserAccount.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (user.status !== "not_verified") {
      return res.status(400).json({
        error:
          "Email is already verified or the account is not in a verifiable state.",
      });
    }

    const isMatchingCode = await compare(code, user.verifCode);
    if (!isMatchingCode) {
      return res.status(400).json({ error: "Invalid verification code." });
    }

    user.status = "active";
    await user.save();

    // Generate a new JWT token
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      status: user.status,
    };
    const expiresIn = getTokenExpirationInSeconds();
    const newAccessToken = sign(tokenPayload, ACCESS_TOKEN_SECRET, {
      expiresIn,
    });

    return res.status(200).json(
      SUCCESSFUL_RESPONSE_WITH_DATA({
        message: "Email successfully verified.",
        accessToken: newAccessToken,
      })
    );
  } catch (error) {
    console.error("Error verifying email:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

const UserAccountController = {
  userRegister,
  userLogin,
  userLogout,
  userRefresh,
  userVerifyEmail,
};

export default UserAccountController;
