import { Request, Response } from "express";
import Post from "./Post.schema";
import Audio from "../Audio/Audio.schema";
import Image from "../Image/Image.schema";
import {
  MISSING_REQUIRED_FIELDS_ERROR,
  MISSING_REQUIRED_PARAMETERS_ERROR,
  SERVER_ERROR_RESPONSE,
  SUCCESSFUL_RESPONSE_WITH_DATA,
} from "../../constants/Responses";
import { deleteFileFromGCS } from "../../utils/gcs";
import { AUDIO_BUCKET_NAME, IMAGE_BUCKET_NAME } from "./Post.constants";

// Controller for POST /posts
const createPost = async (req: Request, res: Response) => {
  try {
    const { audioFilename, audioUrl, content, user, imageFilename, imageUrl } =
      req.body;

    // Create new post object
    const newPost = new Post({
      audio: {
        filename: audioFilename,
        publicUrl: audioUrl,
      },
      content: content,
      userId: user.id,
      image:
        imageFilename && imageUrl
          ? {
              filename: imageFilename,
              publicUrl: imageUrl,
            }
          : null,
    });

    // Save post to the database
    const createdPost = await newPost.save();

    return res
      .status(201)
      .json(SUCCESSFUL_RESPONSE_WITH_DATA(createdPost, 201));
  } catch (error: any) {
    return res.status(500).json(SERVER_ERROR_RESPONSE(error));
  }
};

// Controller for GET /posts/:postId
const getPost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    // Validate postId parameter
    if (!postId) {
      return res.status(400).json(MISSING_REQUIRED_PARAMETERS_ERROR);
    }

    // Fetch post from the database
    const post = await Post.findById(postId).populate("comments");

    return res.status(200).json(SUCCESSFUL_RESPONSE_WITH_DATA(post));
  } catch (error: any) {
    return res.status(500).json(SERVER_ERROR_RESPONSE(error));
  }
};

// Controller for PATCH /posts/:postId
const updatePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    // Validate postId parameter
    if (!postId) {
      return res.status(400).json(MISSING_REQUIRED_PARAMETERS_ERROR);
    }

    // Fetch post from the database
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { content },
      {
        new: true,
      }
    );

    return res.status(200).json(SUCCESSFUL_RESPONSE_WITH_DATA(updatedPost));
  } catch (error: any) {
    return res.status(500).json(SERVER_ERROR_RESPONSE(error));
  }
};

const deletePost = async (req: Request, res: Response) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send({ message: "Post not found." });
    }

    // Delete the post from the database
    await Post.findByIdAndDelete(post.id);

    const dataResponse = {
      message: "Post and associated files deleted successfully.",
    };

    return res.status(200).json(SUCCESSFUL_RESPONSE_WITH_DATA(dataResponse));
  } catch (error: any) {
    console.error("Error deleting post:", error);
    return res.status(500).json(SERVER_ERROR_RESPONSE(error));
  }
};

const generateFeed = async (req: Request, res: Response) => {};

const PostController = {
  createPost,
  getPost,
  updatePost,
  deletePost,
  generateFeed,
};

export default PostController;
