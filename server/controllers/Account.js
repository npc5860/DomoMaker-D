const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => res.render('login');

const logout = (req, res) => {
  req.session.destroy();
  return res.redirect('/');
};

const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  return Account.authenticate(username, pass, (error, account) => {
    if (error || !account) {
      return res.status(401).json({ error: 'Incorrect username or password!' });
    }

    req.session.account = Account.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const newAccount = new Account({
      username,
      password: await Account.generateHash(pass),
    });

    await newAccount.save();

    req.session.account = Account.toAPI(newAccount);

    return res.json({ redirect: '/maker' });
  } catch (e) {
    console.log(e);

    if (e.code === 11000) {
      return res.status(400).json({ error: 'Username already taken!' });
    }

    return res.status(500).json({ error: 'An error occurred!' });
  }
};

module.exports = {
  loginPage,
  logout,
  login,
  signup,
};
