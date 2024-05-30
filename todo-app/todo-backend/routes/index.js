const express = require('express');
const router = express.Router();
const { 
  currentPostStatistic,
  currentSuccessPost,
  visitCountPlus1,
  currentVisitCount, } = require('../util/counter')

const configs = require('../util/config')

/* GET index data. */
router.get('/', async (req, res) => {
  await visitCountPlus1()
  const count = await currentVisitCount()
  res.send({
    // ...configs,
    visitCount: count
  });
});

router.get('/postrequest', async (req, res) => {
  const count = await currentPostStatistic()

  res.send({
    numberOfPostRequest: count
  });
})


router.get('/statistics', async (req, res) => {
  const count = await currentSuccessPost()

  res.status(200).json({
    "added_todos": count
  });
})

module.exports = router;
