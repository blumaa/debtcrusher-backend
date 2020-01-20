var express = require("express");
var router = express.Router();
const Project = require("../../models/").Project;
const ProjectBacker = require("../../models/").ProjectBacker;
const SecondaryBacker = require("../../models/").SecondaryBacker;
const User = require("../../models/").User;

router.get("/", async (req, res, next) => {
  try {
    const projects = await Project.findAll({
      include: [{ model: ProjectBacker, as: "projectBackers" }, { model: User }, { model: SecondaryBacker, as: "secondaryBackers" }]
    });
    res.json(projects);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  // console.log("hello");
  try {
    // if project exists for user, send error
    const projects = await Project.findAll({
      where: {
        userId: req.body.project.userId
      },
      include: [{ model: ProjectBacker, as: "projectBackers" }, { model: User }, { model: SecondaryBacker, as: "secondaryBackers" }]
    });
    if (projects.length > 0) {
      res.status(401).send({ success: false, msg: "Project already exists." });
    } else {
      const newProject = await Project.create({
        name: req.body.project.name,
        goal: req.body.project.goal,
        current_goal: req.body.project.goal,
        video_url: req.body.project.videoUrl,
        school: req.body.project.school,
        userId: req.body.project.userId,
        description: req.body.project.description,
        stripe_user_id: req.body.project.stripeId,
        include: [{ model: ProjectBacker, as: "projectBackers" }, { model: User }, { model: SecondaryBacker, as: "secondaryBackers" }]
      });
      const findProj = await Project.findOne({
        where: {
          userId: req.body.project.userId
        },
        include: [{ model: ProjectBacker, as: "projectBackers" }, { model: User }, { model: SecondaryBacker, as: "secondaryBackers" }]
      })
      // console.log('(((((((((((((((((((((((((((((((((((((((((((((())))))))))))))))))))))))))))))))))))))))))))))')
      // console.log(findProj)
      res.json(findProj);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const currentProj = await Project.findOne({
      where: {
        id: req.body.projectId
      },
      include: [{ model: ProjectBacker, as: "projectBackers" }, { model: User }, { model: SecondaryBacker, as: "secondaryBackers" }]
    });
    console.log('!@#$%^&*()&^%$#@#$%^&*&^$#@#$%^&*&^%$@#$%^&*$#$%^&*(*&$#@#)')
    console.log(currentProj.current_goal)
    console.log(req.body.amount)
    console.log(currentProj.current_goal - req.body.amount)
    const newAmount = currentProj.current_goal - req.body.amount
    currentProj.update({ current_goal: newAmount });
    console.log('!@#$%^&*()&^%$#@#$%^&*&^$#@#$%^&*&^%$@#$%^&*$#$%^&*(*&$#@#)')
    console.log(currentProj.current_goal)
    if (currentProj.current_goal <= 0) {
      currentProj.update({funded:true, current_goal: 0})
      console.log(currentProj)
      res.json(currentProj);
    } else {
      res.json(currentProj)
    }
    console.log('___________________________________________________________________')
    console.log(currentProj)
  } catch (err) {
    next(err);
  }
});

module.exports = router;
