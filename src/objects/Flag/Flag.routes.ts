import { Router } from "express";
import FlagController from "./Flag.controller";
import { validateRequest, verifyAccessToken } from "../../utils/middleware";
const FlagRoutes = Router();

/**
 * Create User Flag
 *
 * This endpoint allows you to flag a user for a specific reason.
 *
 * @swagger
 * /flags:
 *   post:
 *     summary: Flag a User
 *     description: Flag a user for a specific reason.
 *     tags:
 *       - Flags
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         description: User flag data
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - targetUserId
 *             - reason
 *           properties:
 *             targetUserId:
 *               type: string
 *               description: The ID of the user being flagged.
 *             reason:
 *               type: string
 *               description: The reason for flagging the user.
 *     responses:
 *       '200':
 *         description: Flag created successfully.
 *       '400':
 *         description: Invalid request body.
 *       '500':
 *         description: Internal server error.
 */
FlagRoutes.post("/flags", verifyAccessToken, FlagController.createFlag);
