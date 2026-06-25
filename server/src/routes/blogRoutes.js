import { Router } from "express";
import { createBlogController } from "../controllers/blogController.js";

export function createBlogRouter(store) {
  const router = Router();
  const controller = createBlogController(store);

  router.get("/", controller.getPosts);
  router.get("/:slug", controller.getPost);
  router.post("/", controller.createPost);
  router.put("/:id", controller.updatePost);
  router.delete("/:id", controller.deletePost);

  return router;
}
