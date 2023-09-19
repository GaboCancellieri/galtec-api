import { Router } from "express";
import UserAccountController from "./UserAccount.controller";
import { validateRequest } from "../../utils/middleware";
const UserAccountRoutes = Router();

/**
 * @swagger
 * /userAccount/register:
 *   post:
 *     tags:
 *       - UserAccount
 *     summary: Register a new user
 *     description: Register a new user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         description: User registration details
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - username
 *             - email
 *             - password
 *             - DOB
 *           properties:
 *             username:
 *               type: string
 *               description: Username for the new account
 *             email:
 *               type: string
 *               format: email
 *               description: Email address for the new account
 *             password:
 *               type: string
 *               format: password
 *               description: Password for the new account
 *             DOB:
 *               type: string
 *               format: date
 *               description: Date of birth of the user
 *     responses:
 *       201:
 *         description: Successfully registered user
 *       400:
 *         description: Invalid input data
 *       409:
 *         description: Username or Email already exists
 *       500:
 *         description: Server error
 */
UserAccountRoutes.post(
  `/userAccount/register`,
  validateRequest(["username", "email", "password", "DOB"]),
  UserAccountController.userRegister
);

/**
 * @swagger
 * /userAccount/login:
 *   post:
 *     tags:
 *       - UserAccount
 *     summary: Login an existing user
 *     description: Login an existing user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         description: User login credentials
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - email
 *             - password
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *               description: Registered email address of the user
 *             password:
 *               type: string
 *               format: password
 *               description: Password of the user
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         schema:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *               description: JWT token for authenticated user
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized (incorrect credentials)
 *       500:
 *         description: Server error
 */
UserAccountRoutes.post(
  `/userAccount/login`,
  validateRequest(["email", "password"]),
  UserAccountController.userLogin
);

/**
 * @swagger
 * /userAccount/logout:
 *   post:
 *     tags:
 *       - UserAccount
 *     summary: Logout an authenticated user
 *     description: Logout an authenticated user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Authorization
 *         description: Refresh token for the user to logout
 *         in: header
 *         required: true
 *         type: string
 *         format: bearer
 *         default: Bearer <token>
 *     responses:
 *       200:
 *         description: Successfully logged out
 *       401:
 *         description: Unauthorized (invalid or expired refresh token)
 *       500:
 *         description: Server error
 */
UserAccountRoutes.post(`/userAccount/logout`, UserAccountController.userLogout);

/**
 * @swagger
 * /userAccount/refresh:
 *   post:
 *     tags:
 *       - UserAccount
 *     summary: Refresh an authenticated user's access token
 *     description: Refresh an authenticated user's access token
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Authorization
 *         description: Refresh token for the user
 *         in: header
 *         required: true
 *         type: string
 *         format: bearer
 *         default: Bearer <token>
 *     responses:
 *       200:
 *         description: Successfully refreshed the token
 *         schema:
 *           type: object
 *           properties:
 *             accessToken:
 *               type: string
 *               description: The new access token for the user
 *             refreshToken:
 *               type: string
 *               description: The new refresh token for the user
 *       401:
 *         description: Unauthorized (invalid or expired refresh token)
 *       500:
 *         description: Server error
 */
UserAccountRoutes.post(
  `/userAccount/refresh`,
  UserAccountController.userRefresh
);

/**
 * @swagger
 * /userAccount/verify-email:
 *   post:
 *     tags:
 *       - UserAccount
 *     summary: Verify a user's email address
 *     description: Verify a user's email address
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         description: User Email verification details
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - email
 *             - code
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *               description: Email address of the user to verify
 *             code:
 *               type: string
 *               description: Verification code sent to the email address
 *     responses:
 *       200:
 *         description: Email successfully verified
 *       400:
 *         description: Bad request (e.g., missing or invalid fields)
 *       401:
 *         description: Unauthorized (e.g., invalid verification code)
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
UserAccountRoutes.post(
  `/userAccount/verify-email`,
  validateRequest(["email", "code"]),
  UserAccountController.userVerifyEmail
);

export default UserAccountRoutes;
