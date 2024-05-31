const express = require('express');
const { Todo } = require('../mongo')
const router = express.Router();
const { postStatisticPlus1, successPostPlus1 } = require('../util/counter')

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
/* when request to post route add count */
router.post('/', async (req, res) => {

  await postStatisticPlus1()
  try {
    const todo = await Todo.create({
      text: req.body.text,
      done: false
    })
    await successPostPlus1()
    res.send(todo);
  } catch (error) {

  }
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  // need to implement middleware to handle known error , eg. CastError
  // use try catch in this block for now
  try {
    req.todo = await Todo.findById(id)
    if (!req.todo) { 
      console.log('!req.todo')
      return res.sendStatus(404)
    }
    next()
  } catch(error) {
    console.log('error name', error)
    return res.status(404).send('the note id is malformated')
  }
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res, next) => {
  try {
    const foundNote = await req.todo
    return res.json(foundNote)
  } catch(error) {
    res.sendStatus(404); // Implement this
    next(error)
  }
});

/* PUT todo. */
singleRouter.put('/', async (req, res, next) => {
  const { text, done } = req.body;
  try {
    const foundNote = await req.todo
    if (text) {
      foundNote.text = text
    }
    if (done) {
      foundNote.done = done
    }
    if (text || done) {
      await foundNote.save()
    }
    return res.status(200).json(foundNote)
  } catch (error) {
    res.sendStatus(404); // Implement this
    next(error)
  }

});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
