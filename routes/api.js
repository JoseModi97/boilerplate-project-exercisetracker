const router = require('express').Router();
const User = require('../models/User');
const Exercise = require('../models/Exercise');

router.post('/users', async (req, res) => {
  const user = new User({ username: req.body.username });
  try {
    const savedUser = await user.save();
    res.json(savedUser);
  } catch (err) {
    res.json({ error: err.message });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.json({ error: err.message });
  }
});

router.post('/users/:_id/exercises', async (req, res) => {
  const { description, duration, date } = req.body;
  const userId = req.params._id;
  const exercise = new Exercise({
    userId,
    description,
    duration,
    date: date ? new Date(date) : new Date(),
  });
  try {
    const savedExercise = await exercise.save();
    const user = await User.findById(userId);
    res.json({
      username: user.username,
      description: savedExercise.description,
      duration: savedExercise.duration,
      date: savedExercise.date.toDateString(),
      _id: user._id,
    });
  } catch (err) {
    res.json({ error: err.message });
  }
});

router.get('/users/:_id/logs', async (req, res) => {
  const userId = req.params._id;
  const { from, to, limit } = req.query;
  const user = await User.findById(userId);
  let query = { userId };
  if (from) {
    query.date = { $gte: new Date(from) };
  }
  if (to) {
    query.date = { ...query.date, $lte: new Date(to) };
  }
  let exerciseQuery = Exercise.find(query);
  if (limit) {
    exerciseQuery = exerciseQuery.limit(parseInt(limit));
  }
  try {
    const exercises = await exerciseQuery.exec();
    res.json({
      username: user.username,
      count: exercises.length,
      _id: user._id,
      log: exercises.map(e => ({
        description: e.description,
        duration: e.duration,
        date: e.date.toDateString(),
      })),
    });
  } catch (err) {
    res.json({ error: err.message });
  }
});

module.exports = router;
