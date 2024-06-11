const express = require("express");
const postsRouter = express.Router();

const { requireUser } = require("./utils");

const {
  createPost,
  getAllPosts,
  updatePost,
  getPostById,
  deletePost,
} = require("../db");

// (works) gets all posts for all users
postsRouter.get("/", async (req, res, next) => {
  try {
    const allPosts = await getAllPosts();

    const posts = allPosts.filter((post) => {
      // the post is active, doesn't matter who it belongs to
      if (post.active) {
        return true;
      }

      // the post is not active, but it belogs to the current user
      if (req.user && post.author.id === req.user.id) {
        return true;
      }

      // none of the above are true
      return false;
    });

    res.send({
      posts,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// (works) Creates a post IF requireUser is met (e.g. if logged in user)
// Needs: "authorId" "title" "content" "tags" (in array format)

postsRouter.post("/", requireUser, async (req, res, next) => {
  try {
    res.send(await createPost(req.body));
  } catch (error) {
    next(error);
  }
});

postsRouter.patch("/:postId", requireUser, async (req, res, next) => {
  const { postId } = req.params;
  const { title, content, tags } = req.body;

  const updateFields = {};

  if (tags && tags.length > 0) {
    updateFields.tags = tags.trim().split(/\s+/);
  }

  if (title) {
    updateFields.title = title;
  }

  if (content) {
    updateFields.content = content;
  }

  try {
    const originalPost = await getPostById(postId);

    if (originalPost.author.id === req.user.id) {
      const updatedPost = await updatePost(postId, updateFields);
      res.send({ post: updatedPost });
    } else {
      next({
        name: "UnauthorizedUserError",
        message: "You cannot update a post that is not yours",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// (works) deletes a post based on postId params; also deletes associated tags in post_tags
postsRouter.delete("/:postId", requireUser, async (req, res, next) => {
  try {
    res.send(await deletePost(req.params.postId)).sendStatus(204);
  } catch (error) {
    next(error);
  }
});

module.exports = postsRouter;
