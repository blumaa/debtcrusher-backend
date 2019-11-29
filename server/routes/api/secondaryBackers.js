var express = require("express");
const router = express.Router();
const SecondaryBacker = require("../../models/").SecondaryBacker;


router.post('/', async (req, res, next) => {
  console.log('**********************************************************************')
  console.log(req.body)
  try {
    const newSecondaryBacker = await SecondaryBacker.create({
      amount: req.body.amount,
      secondaryBackerId: req.body.userId,
      secondaryProjectId: req.body.projectId
    })
    res.json(newSecondaryBacker)
  } catch (err) {
    next(err)
  }
})

router.get('/', async (req, res, next) => {
  try {
    const secondaryBackers = await SecondaryBacker.findAll()
    res.json(secondaryBackers)
  } catch (err) {
    next(err)
  }
})

module.exports = router;
