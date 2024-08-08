import * as dao from "./dao.js";

export default function PostRoutes(app) {
  const createPost = async (req, res) => {
    const post = await dao.createPost(req.body);
    res.json(post);
  };

  const findAllPosts = async (req, res) => {
    const { limit = 10, skip = 0 } = req.query;
    const posts = await dao.findAllPosts(Number(limit), Number(skip));
    res.json(posts);
  };

  const findPostById = async (req, res) => {
    const post = await dao.findPostById(req.params.postId);
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  };

  const findPostsByUser = async (req, res) => {
    const { limit = 10, skip = 0 } = req.query;
    const posts = await dao.findPostsByUser(req.params.userId, Number(limit), Number(skip));
    res.json(posts);
  };

  const updatePost = async (req, res) => {
    const { postId } = req.params;
    const status = await dao.updatePost(postId, req.body);
    res.json(status);
  };

  const deletePost = async (req, res) => {
    const status = await dao.deletePost(req.params.postId);
    res.json(status);
  };

  const likePost = async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.body;
    const status = await dao.likePost(postId, userId);
    res.json(status);
  };

  const unlikePost = async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.body;
    const status = await dao.unlikePost(postId, userId);
    res.json(status);
  };

  const addComment = async (req, res) => {
    const { postId } = req.params;
    const status = await dao.addComment(postId, req.body);
    res.json(status);
  };

  const removeComment = async (req, res) => {
    const { postId, commentId } = req.params;
    const status = await dao.removeComment(postId, commentId);
    res.json(status);
  };

  const incrementShareCount = async (req, res) => {
    const { postId } = req.params;
    const status = await dao.incrementShareCount(postId);
    res.json(status);
  };

  const findPostsByContent = async (req, res) => {
    const { content } = req.params;
    const posts = await dao.findPostsByContent(content);
    res.json(posts);
  };

  app.post("/api/posts", createPost);
  app.get("/api/posts", findAllPosts);
  app.get("/api/posts/:postId", findPostById);
  app.get("/api/users/:userId/posts", findPostsByUser);
  app.put("/api/posts/:postId", updatePost);
  app.delete("/api/posts/:postId", deletePost);
  app.post("/api/posts/:postId/like", likePost);
  app.post("/api/posts/:postId/unlike", unlikePost);
  app.post("/api/posts/:postId/comment", addComment);
  app.delete("/api/posts/:postId/comment/:commentId", removeComment);
  app.post("/api/posts/:postId/share", incrementShareCount);
  app.get("/api/posts/search/:content", findPostsByContent);
}