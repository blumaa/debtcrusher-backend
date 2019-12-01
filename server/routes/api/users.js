const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const router = express.Router();
require("../../config/passport")(passport);
const User = require("../../models").User;
const Project = require("../../models").Project;
const ProjectBacker = require("../../models/").ProjectBacker;
var formidable = require("formidable");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject file
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/gif"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 8
  },
  fileFilter: fileFilter
});


router.get("/", async (req, res, next) => {
  try {
    const users = await User.findAll({
      include: [
        { model: Project, as: "project" },
        { model: ProjectBacker, as: "backing" }
      ]
    });
    console.log("****************************************");
    console.log(users);
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.post("/signup", upload.single("userImage"), (req, res) => {
  console.log('**********************************************************')
  console.log(req)
  console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  console.log(req.file);
  console.log('**********************************************************')
  console.log(req.body);
  if (!req.body.username || !req.body.password) {
    res.status(400).send({ msg: "Please pass username and password." });
  } else {
    User.create({
      username: req.body.username,
      password: req.body.password,
      bio: req.body.bio,
      displayName: req.body.displayName,
      birthDate: req.body.birthDate,
      userImage: req.file.path,
      include: [
        { model: Project, as: "project" },
        { model: ProjectBacker, as: "backing" }
      ]
    })
      .then(user => {
        var token = jwt.sign(
          JSON.parse(JSON.stringify(user)),
          "nodeauthsecret",
          { expiresIn: 86400 * 30 }
        );

        const {
          id,
          username,
          displayName,
          bio,
          birthDate,
          donationPool,
          project,
          backing,
          userImage
        } = user;
        res.json({
          success: true,
          token: token,
          user: {
            id,
            username,
            displayName,
            bio,
            birthDate,
            donationPool,
            project,
            backing,
            userImage
          }
        });
        res.status(201).send(user);
      })
      .catch(error => {
        console.log(error);
        res.status(400).send(error);
      });
  }
});

router.post("/login", function(req, res) {
  User.findOne({
    where: {
      username: req.body.username
    },
    include: [
      { model: Project, as: "project" },
      { model: ProjectBacker, as: "backing" }
    ]
  })
    .then(user => {
      if (!user) {
        return res.status(401).send({
          message: "Authentication failed. User not found."
        });
      }
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (isMatch && !err) {
          var token = jwt.sign(
            JSON.parse(JSON.stringify(user)),
            "nodeauthsecret",
            { expiresIn: 86400 * 30 }
          );
          // jwt.verify(token, 'nodeauthsecret', function(err, data){
          //   console.log(err, data);
          // })
          // console.log(
          //   "********************************************************************"
          // );
          // console.log(user);
          const {
            id,
            username,
            displayName,
            bio,
            birthDate,
            donationPool,
            project,
            backing,
            userImage
          } = user;
          res.json({
            success: true,
            token: token,
            user: {
              id,
              username,
              displayName,
              bio,
              birthDate,
              donationPool,
              project,
              backing,
              userImage
            }
          });
        } else {
          res.status(401).send({
            success: false,
            msg: "Authentication failed. Wrong password."
          });
        }
      });
    })
    .catch(error => res.status(400).send(error));
});

router.get("/authenticateUser", function(req, res) {
  console.log(req.headers);
  jwt.verify(req.headers.authorization, "nodeauthsecret", function(
    err,
    authorizedData
  ) {
    if (err) {
      console.log("ERROR: could not authenticate user");
      res.sendStatus(403);
    } else {
      res.json({
        message: "Successful login",
        user: authorizedData
      });
      console.log("SUCCESS: User logged in");
    }
  });

  // Grab token from header
  // Verify the token
  // if valid send back user
  // else send back error
});

getToken = function(headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(" ");
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

router.patch("/:id", async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.body.id
      },
      include: [{ model: Project, as: "project" }]
    });
    user.update({ donationPool: user.donationPool + req.body.donationPool });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.patch("/:id/donationSubtract", async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.body.id
      },
      include: [{ model: Project, as: "project" }]
    });
    user.update({ donationPool: user.donationPool - req.body.amount });
    console.log(
      "_____________________________________________________________________"
    );
    console.log(user);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
