import { Request, Response } from "express";
import { CommentService } from "./comment.service";

const createComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    req.body.authorId = user?.id;
    const result = await CommentService.createComment(req.body);
    res.status(201).send(result);
  } catch (e) {
    res.status(400).json({
      error: "comment creation failed",
      details: e,
    });
  }
};

export const commentController = {
  createComment,
};
