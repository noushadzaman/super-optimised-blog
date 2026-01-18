import { Request, Response } from "express";
import { postServices } from "./post.service";

const createPost = async (req: Request, res: Response) => {
  console.log({ req, res });
  try {
    const result = await postServices.createPost(req.body);
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
