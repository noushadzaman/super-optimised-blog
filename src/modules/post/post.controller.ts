import { Request, Response } from "express";
import { postServices } from "./post.service";

const createPost = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.status(400).json({
      error: "Unauthorized",
    });
  }
  try {
    const result = await postServices.createPost(req.body, user.id as string);
    res.status(201).send(result);
  } catch (e) {
    res.status(400).json({
      error: "Post creation failed",
      details: e,
    });
  }
};

export const PostController = {
  createPost,
};
