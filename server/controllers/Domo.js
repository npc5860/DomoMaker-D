const models = require('../models');

const { Domo } = models;

const makerPage = async (req, res) => res.render('app');

const makeDomo = async (req, res) => {
  const name = `${req.body.name}`;
  const age = `${req.body.age}`;

  if (!name || !age) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  try {
    const newDomo = new Domo({
      name,
      age,
      owner: req.session.account._id,
    });

    await newDomo.save();

    return res.status(201).json({ name, age });
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
      .select('name age').lean().exec();

    return res.json({ domos });
  } catch (e) {
    console.log(e);

    return res.status(500).json({ error: 'Internal server error!' });
  }
};

module.exports = {
  makerPage,
  makeDomo,
  getDomos,
};
