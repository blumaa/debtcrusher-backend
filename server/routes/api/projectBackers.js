var express = require("express");
const router = express.Router();
const ProjectBacker = require("../../models/").ProjectBacker;

router.post('/', async (req, res, next) => {
  try {
    const newBacker = await ProjectBacker.create({
      backerId: req.body.backerId,
      primaryProjectId: req.body.projectId,
      amount: req.body.amount
    })
    console.log(newBacker)
    res.json(newBacker)
  } catch (err) {
    next(err)
  }
})

router.get('/', async (req, res, next) => {
  try {
    const backers = await ProjectBacker.findAll()
    res.json(backers)
  } catch (err) {
    next(err)
  }
})

module.exports = router;
