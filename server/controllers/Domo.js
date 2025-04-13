const models = require('../models');

const { Domo } = models;

const makerPage = async (req, res) => res.render('app');

const makeDomo = async (req, res) => {
  const name = `${req.body.name}`;
  const age = `${req.body.age}`;
  const level = `${req.body.level}`;

  if (!name || !age || !level) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  try {
    const newDomo = new Domo({
      name,
      age,
      level,
      owner: req.session.account._id,
    });

    await newDomo.save();

    return res.status(201).json({ name, age, level });
  } catch (e) {
    console.log(e);

    if (e.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists!' });
    }

    return res.status(400).json({ error: 'An error occurred!' });
  }
};

const getDomos = async (req, res) => {
  try {
    const domos = await Domo.find({ owner: req.session.account._id })
      .select('name age level').lean().exec();

    return res.json({ domos });
  } catch (e) {
    console.log(e);

    return res.status(500).json({ error: 'Internal server error!' });
  }
};

const deleteDomo = async (req, res) => {
  const id = `${req.body.id}`;

  if (!id) {
    return res.status(400).json({ error: 'An ID is required!' });
  }

  try {
    await Domo.deleteOne({ _id: id });

    return res.status(200).json({ id });
  } catch (e) {
    console.log(e);

    return res.status(500).json({ error: 'Internal server error!' });
  }
};

module.exports = {
  makerPage,
  makeDomo,
  getDomos,
  deleteDomo,
};
