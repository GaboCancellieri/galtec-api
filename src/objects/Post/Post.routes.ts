import { Router } from "express";
import PostController from "./Post.controller";
import { validateRequest, verifyAccessToken } from "../../utils/middleware";
const PostRoutes = Router();

/**
 * @swagger
 * /posts/{postId}:
 *   get:
 *     tags:
 *       - Posts
 *     summary: Retrieves a specific post by its ID
 *     description: Retrieves a specific post by its ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Authorization
 *         description: Token for user authentication
 *         in: header
 *         required: true
 *         type: string
 *         default: Bearer <token>
 *       - name: postId
 *         description: ID of the post to retrieve.
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved post
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 */
PostRoutes.get("/posts/:postId", verifyAccessToken, PostController.getPost);

/**
 * @swagger
 * /posts:
 *   post:
 *     tags:
 *       - Posts
 *     summary: Creates a new post
 *     description: Creates a new post
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Authorization
 *         description: Token for user authentication
 *         in: header
 *         required: true
 *         type: string
 *         default: Bearer <token>
 *       - name: body
 *         in: body
 *         description: Post creation details
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - audioFilename
 *             - audioUrl
 *             - content
 *           properties:
 *             audioFilename:
 *               type: string
 *               description: Filename of the audio.
 *             audioUrl:
 *               type: string
 *               description: URL where the audio is stored.
 *             content:
 *               type: string
 *               format: password
 *               description: Content/text of the post.
 *             imageFilename:
 *               type: string
 *               description: Filename of the image (optional).
 *             imageUrl:
 *               type: string
 *               description: URL where the image is stored (optional).
 *     responses:
 *       200:
 *         description: Successfully created post
 *       400:
 *         description: Missing required fields or other request error
 *       401:
 *         description: Unauthorized
 */
PostRoutes.post(
  "/posts",
  verifyAccessToken,
  validateRequest(["audioFilename", "audioUrl", "content"]),
  PostController.createPost
);

/**
 * @swagger
 * /posts/{postId}:
 *   patch:
 *     tags:
 *       - Posts
 *     summary: Updates the content of a specific post by its ID
 *     description: Updates the content of a specific post by its ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Authorization
 *         description: Token for user authentication
 *         in: header
 *         required: true
 *         type: string
 *         default: Bearer <token>
 *       - name: postId
 *         description: ID of the post to update.
 *         in: path
 *         required: true
 *         type: string
 *       - name: content
 *         description: New content for the post.
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             content:
 *               type: string
 *     responses:
 *       200:
 *         description: Successfully updated post content
 *       400:
 *         description: Bad request (e.g., invalid content format)
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 */
PostRoutes.patch(
  "/posts/:postId",
  verifyAccessToken,
  validateRequest(["content"]),
  PostController.updatePost
);

/**
 * @swagger
 * /posts/{postId}:
 *   delete:
 *     tags:
 *       - Posts
 *     summary: Deletes a specific post by its ID
 *     description: Deletes a specific post by its ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Authorization
 *         description: Token for user authentication
 *         in: header
 *         required: true
 *         type: string
 *         default: Bearer <token>
 *       - name: postId
 *         description: ID of the post to delete.
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successfully deleted post
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
PostRoutes.delete(
  "/posts/:postId",
  verifyAccessToken,
  PostController.deletePost
);

// Other Operations
PostRoutes.get("/posts/feed", PostController.generateFeed);

export default PostRoutes;
