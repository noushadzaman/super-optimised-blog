import { NextFunction, Request, Response } from "express";
import { postServices } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelpers";
import { UserRole } from "../../middlewares/auth";

const createPost = async (req: Request, res: Response, next: NextFunction) => {
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
    next();
  }
};

const getPostById = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    if (!postId) {
      throw new Error("Post Id is required!");
    }
    const result = await postServices.getPostById(postId as string);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({
      error: "Post retrieval failed",
      details: e,
    });
  }
};

const getAllPost = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : undefined;

    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];

    // true or false
    const isFeatured = req.query.isFeatured
      ? req.query.isFeatured === "true"
        ? true
        : req.query.isFeatured === "false"
          ? false
          : undefined
      : undefined;

    const status = req.query.status as PostStatus | undefined;

    const authorId = req.query.authorId as string | undefined;

    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(
      req.query,
    );

    const result = await postServices.getAllPost({
      search: searchString,
      tags,
      isFeatured,
      status,
      authorId,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({
      error: "Post creation failed",
      details: e,
    });
  }
};

const getStats = async (req: Request, res: Response) => {
  try {
    const result = await postServices.getStats();
    res.status(200).json(result);
  } catch (e) {
    const errorMessage =
      e instanceof Error ? e.message : "Stats fetched failed!";
    res.status(400).json({
      error: errorMessage,
      details: e,
    });
  }
};

const getMyPosts = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("u r not authorized");
    }
    const result = await postServices.getMyPosts(user.id);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({
      error: "Post fetch failed",
      details: e,
    });
  }
};

const updatePost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("u r not authorized");
    }
    const { postId } = req.params;
    const isAdmin = user.role === UserRole.ADMIN;
    const result = await postServices.updatePost(
      postId as string,
      req.body,
      user.id,
      isAdmin,
    );
    res.status(200).json(result);
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "post update failed!";
    res.status(400).json({
      error: errorMessage,
      details: e,
    });
  }
};

const deletePost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("u r not authorized");
    }
    const { postId } = req.params;
    const isAdmin = user.role === UserRole.ADMIN;
    const result = await postServices.deletePost(
      postId as string,
      user.id,
      isAdmin,
    );
    res.status(200).json(result);
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "post delete failed!";
    res.status(400).json({
      error: errorMessage,
      details: e,
    });
  }
};

export const PostController = {
  createPost,
  getAllPost,
  getPostById,
  getStats,
  getMyPosts,
  updatePost,
  deletePost,
};
