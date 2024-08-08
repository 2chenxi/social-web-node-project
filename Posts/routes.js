import * as dao from './dao.js'; // Adjust path as necessary
import upload from '../Imgs/upload.js'; // Adjust path as necessary

export default function PostsRoutes(app) {

  const createPost = async (req, res) => {
    try {
      const { user, content } = req.body;
  
      // Validate required fields
      if (!user || !content) {
        return res.status(400).json({ message: "User and content are required." });
      }
  
      // Handle images if present
      const images = req.files ? req.files.map(file => ({
        path: file.path,
        filename: file.filename
      })) : [];
  
      const postDetails = { user, content, images };
      const newPost = await dao.createPost(postDetails);
  
      res.status(201).json(newPost);
    } catch (error) {
      console.error("Error creating post:", error); // Log the error for debugging
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  };
  

  const findAllPosts = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const skip = parseInt(req.query.skip) || 0;
    try {
      const posts = await dao.findAllPosts(limit, skip);
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const findPostById = async (req, res) => {
    try {
      const post = await dao.findPostById(req.params.pid);
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: 'Post not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const findPostsByUser = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const skip = parseInt(req.query.skip) || 0;
    try {
      const posts = await dao.findPostsByUser(req.params.uid, limit, skip);
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const updatePost = async (req, res) => {
    try {
      const updatedPost = await dao.updatePost(req.params.pid, req.body);
      if (updatedPost.nModified > 0) {
        res.status(200).json({ message: 'Post updated successfully' });
      } else {
        res.status(404).json({ message: 'Post not found or no changes made' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const deletePost = async (req, res) => {
    try {
      const result = await dao.deletePost(req.params.pid);
      if (result.deletedCount > 0) {
        res.status(200).json({ message: 'Post deleted successfully' });
      } else {
        res.status(404).json({ message: 'Post not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const likePost = async (req, res) => {
    try {
      await dao.likePost(req.params.pid, req.body.userId);
      res.status(200).json({ message: 'Post liked successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const unlikePost = async (req, res) => {
    try {
      await dao.unlikePost(req.params.pid, req.body.userId);
      res.status(200).json({ message: 'Post unliked successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const addComment = async (req, res) => {
    try {
      await dao.addComment(req.params.pid, req.body.comment);
      res.status(200).json({ message: 'Comment added successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const removeComment = async (req, res) => {
    try {
      await dao.removeComment(req.params.pid, req.params.cid);
      res.status(200).json({ message: 'Comment removed successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const incrementShareCount = async (req, res) => {
    try {
      await dao.incrementShareCount(req.params.pid);
      res.status(200).json({ message: 'Share count incremented successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const findPostsByContent = async (req, res) => {
    try {
      const posts = await dao.findPostsByContent(req.query.q);
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  app.post('/api/posts', upload.array('images', 5), createPost);
  app.get('/api/posts', findAllPosts);
  app.get('/api/posts/:pid', findPostById);
  app.get('/api/users/:uid/posts', findPostsByUser);
  app.put('/api/posts/:pid', updatePost);
  app.delete('/api/posts/:pid', deletePost);
  app.post('/api/posts/:pid/like', likePost);
  app.post('/api/posts/:pid/unlike', unlikePost);
  app.post('/api/posts/:pid/comment', addComment);
  app.delete('/api/posts/:pid/comment/:cid', removeComment);
  app.post('/api/posts/:pid/share', incrementShareCount);
  app.get('/api/posts/search', findPostsByContent);
}


  // app.post("/api/posts", createPost);
  // app.get("/api/posts", findAllPosts);
  // app.get("/api/posts/:postId", findPostById);
  // app.get("/api/users/:userId/posts", findPostsByUser);
  // app.put("/api/posts/:postId", updatePost);
  // app.delete("/api/posts/:postId", deletePost);
  // app.post("/api/posts/:postId/like", likePost);
  // app.post("/api/posts/:postId/unlike", unlikePost);
  // app.post("/api/posts/:postId/comment", addComment);
  // app.delete("/api/posts/:postId/comment/:commentId", removeComment);
  // app.post("/api/posts/:postId/share", incrementShareCount);
  // app.get("/api/posts/search/:content", findPostsByContent);
