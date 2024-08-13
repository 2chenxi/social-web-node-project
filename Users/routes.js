import * as dao from "./dao.js";
// let currentUser = null;
export default function UserRoutes(app) {
  const createUser = async (req, res) => { 
    const user = await dao.createUser(req.body);
    res.json(user);
  };

  const deleteUser = async (req, res) => {
    const status = await dao.deleteUser(req.params.userId);
    res.json(status);
   };

  const findAllUsers = async (req, res) => { 
    const { name } = req.query;

    if (name) {
      const users = await dao.findUsersByPartialName(name);
      res.json(users);
      return;
    }

    const users = await dao.findAllUsers();
    res.json(users);
  };

  const findUserById = async (req, res) => {
    const user = await dao.findUserById(req.params.userId);
    res.json(user);
   };

  const findUsersFollowings = async (req, res) => {
    try {
      const user = await dao.findUserById(req.params.userId).populate('following', 'username profilePicture');
      // console.log(user);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user.following);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  const findUsersFollowers = async (req, res) => {
    try {
      const user = await dao.findUserById(req.params.userId).populate('followers', 'username profilePicture');
      console.log(user);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user.followers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  const getUserReviewedPosts = async (req, res) => {
    try {
      const reviews = await dao.findReviewedPostsByUser(req.params.userId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

  const updateUser = async (req, res) => {
    const { userId } = req.params;
    const status = await dao.updateUser(userId, req.body);
    res.json(status);
  };

  const signup = async (req, res) => {
    const user = await dao.findUserByUsername(req.body.username);
    if (user) {
      res.status(400).json(
        { message: "Username already taken" });
      return;
    }
    const currentUser = await dao.createUser(req.body);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };

  const signin = async (req, res) => { 
    const { username, password } = req.body;
    const currentUser = await dao.findUserByCredentials(username, password);
    if (currentUser) {
      req.session["currentUser"] = currentUser;
      res.json(currentUser);
    } else {
      res.status(401).json({ message: "Unable to login. Try again later." });
    }
  };

  const signout = (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  };

  const profile = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    res.json(currentUser);
   };

   const followUser = async (req, res) => {
    try {
      const { loggedInUserId, profileUserId } = req.params;
      const [updatedLoggedInUser, updatedProfileUser] = await Promise.all([
        dao.addFollowing(loggedInUserId, profileUserId),
        dao.addFollower(profileUserId, loggedInUserId)
      ]);
      res.json({ updatedLoggedInUser, updatedProfileUser });
    } catch (error) {
      console.error('Error in followUser:', error);
      res.status(500).json({ message: error.message });
    }
  };

  const unfollowUser = async (req, res) => {
    try {
      const { loggedInUserId, profileUserId } = req.params;
      const [updatedLoggedInUser, updatedProfileUser] = await Promise.all([
        dao.removeFollowing(loggedInUserId, profileUserId),
        dao.removeFollower(profileUserId, loggedInUserId)
      ]);
      res.json({ updatedLoggedInUser, updatedProfileUser });
    } catch (error) {
      console.error('Error in unfollowUser:', error);
      res.status(500).json({ message: error.message });
    }
  };
  
  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.get("/api/users/:userId/followings", findUsersFollowings);
  app.get("/api/users/:userId/followers", findUsersFollowers);
  app.get('/api/users/:userId/reviews', getUserReviewedPosts);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
  app.post("/api/users/:loggedInUserId/following/:profileUserId", followUser);
  app.delete("/api/users/:loggedInUserId/following/:profileUserId", unfollowUser);
  app.post("/api/users/:profileUserId/followers/:loggedInUserId", followUser);
  app.delete("/api/users/:profileUserId/followers/:loggedInUserId", unfollowUser);
}
