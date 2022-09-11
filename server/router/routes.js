const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Posts = require("../models/posts.js");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const Spaces = require("../models/chat");
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

router.get("/", (req, res) => {
  res.json({ message: "This is the api" });
});

router.post("/register", async (req, res) => {
  const {
    fullname,
    username,
    email,
    password,
    cpassword,
    institution,
    profilePic,
    collegeStream,
    collegeYear,
    linkedIn,
    github,
    experience,
    skills,
    achievements,
  } = req.body;

  if (
    !fullname ||
    !username ||
    !email ||
    !password ||
    !cpassword
  ) {
    return res.status(422).json({ error: "Please fill all the fields." });
  }

  try {
    const userSearchByEmail = await User.findOne({ email: email });
    const userSearchByUsername = await User.findOne({ username: username });

    if (userSearchByEmail || userSearchByUsername) {
      return res.status(422).json({ error: "user already exists." });
    }

    if (password !== cpassword) {
      return res.status(422).json({ error: "passwords dont match." });
    } else {
      const user = new User({
        fullname,
        email,
        password,
        cpassword,
        username,
      });

      const registered = await user.save();

      res.status(201).json({ message: "Registered Successfully!", sucess: true });
    }
  } catch (e) {
    res.status(500).json({ message: `Could not create account! --> ${e}`, sucess: false });
  }
});

router.post("/login", async (req, res) => {
  try {
    const logEmail = req.body.email;
    const logPass = req.body.password;

    if (!logEmail || !logPass) {
      return res.status(422).json({ error: "Please fill all the fields." });
    }

    const userEmail = await User.findOne({ email: logEmail });
    const passCheck = await bcrypt.compare(logPass, userEmail.password);
    const user = await User.findOne({ email: logEmail });

    const token = await userEmail.generateAuthToken();

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 60000000),
      httpOnly: true,
    });

    // res.send(token);

    if (passCheck) {
      res.json({
        message: "Logged In Successfully!",
        token: token,
        sucess: true,
        user: user,
      });
    } else {
      res.status(400).json({ message: "Invalid login credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Invalid login credentials" });
  }
});

router.post("/post-feed", async (req, res) => {
  try {
    const { name, username, title, email, skills, year, date } = req.body;

    if (!username || !title || !email || !skills || !name) {
      return res.status(422).json({ error: "Please fill all the fields." });
    } else {

      const userFound = await User.findOne({username : username});

      const postsFound = await Posts.find({username : username});

      const postsCount = postsFound.length;

      const updatePostCount = await userFound.updatePost(postsCount);

      const posts = new Posts({
        name,
        username,
        date,
        title,
        email,
        skills,
        year
      });

    
      const postedFeed = await posts.save();
 

      res.status(201).json({ posts: posts, success: true });
    }
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/getAllPosts", async (req, res) => {
  try {
    const allPosts = await Posts.find();
    res.send(allPosts);
  } catch (e) {
    res.send(e);
  }
});

router.post("/post-like", async (req, res) => {
  const { id, username } = req.body;

  if (!id || !username) {
    return res.status(422).json({ error: "Please fill all the fields." });
  }
  try {
    const likePost = await Posts.findOne({ _id: id });

    const upvoted = await likePost.upvote(username);

    if (upvoted) {
      res.json({ message: "Upvoted Successfully!" });
    } else {
      res.json({ message: "Could not upvote!" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});





module.exports = router;
