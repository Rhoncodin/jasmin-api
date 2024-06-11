const query = require('../config/database');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

const register = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  if (firstname == '' || lastname == '' || email == '' || password == '') {
    const message =
      firstname == ''
        ? 'First name is required'
        : lastname == ''
        ? 'Last name is required'
        : email == ''
        ? 'Email is required'
        : password == ''
        ? 'Password is required'
        : '';

    return res.status(400).json({ message: message, status: 400 });
  }

  const salt = await bcryptjs.genSalt(12);
  const hash = await bcryptjs.hash(password.toString(), salt);
  const userType = 2;

  const statement = await query(
    `INSERT INTO user (firstname, lastname, email, password, user_type) VALUES (?, ?, ?, ?, ?)`,
    [firstname, lastname, email, hash, userType]
  );

  try {
    const result = statement;
    const message =
      result.affectedRows < 1
        ? 'Failed to register user'
        : 'User registered successfully';
    const status = result.affectedRows < 1 ? 400 : 200;
    return res.status(status).json({
      message: message,
      status: status,
      data: result.affectedRows < 1 ? null : req.body,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal error', status: 500 });
  }
};

const registerAdmin = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  if (firstname == '' || lastname == '' || email == '' || password == '') {
    const message =
      firstname == ''
        ? 'First name is required'
        : lastname == ''
        ? 'Last name is required'
        : email == ''
        ? 'Email is required'
        : password == ''
        ? 'Password is required'
        : '';

    return res.status(400).json({ message: message, status: 400 });
  }

  const salt = await bcryptjs.genSalt(12);
  const hash = await bcryptjs.hash(password.toString(), salt);
  const userType = 1;

  const statement = await query(
    `INSERT INTO user (firstname, lastname, email, password, user_type) VALUES (?, ?, ?, ?, ?)`,
    [firstname, lastname, email, hash, userType]
  );

  try {
    const result = statement;
    const message =
      result.affectedRows < 1
        ? 'Failed to register admin'
        : 'Admin registered successfully';
    const status = result.affectedRows < 1 ? 400 : 200;
    return res.status(status).json({
      message: message,
      status: status,
      data: result.affectedRows < 1 ? null : req.body,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal error', status: 500 });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (email == '' || password == '') {
    const message =
      email == ''
        ? 'Email is required'
        : password == ''
        ? 'Password is required'
        : '';

    return res.status(400).json({ message: message, status: 400 });
  }

  const statementLogin = await query(
    `SELECT id, firstname, lastname, email, password, user_type FROM user WHERE email = ?`,
    [email]
  );

  const statement = statementLogin?.length > 0 ? statementLogin[0] : null;

  if (statement == null) {
    return res
      .status(400)
      .json({ message: 'User does not exist', status: 400 });
  }

  try {
    const passwordMatch = bcryptjs.compareSync(
      password.toString(),
      statement.password
    );

    if (!passwordMatch) {
      return res.status(400).json({
        message: 'Password does not match',
        status: 400,
      });
    }

    const payload = {
      id: statement?.id,
      firstname: statement?.firstname,
      lastname: statement?.lastname,
      email: statement?.email,
      user_type: statement?.user_type,
    };

    const token = jwt.sign(payload, process.env.SECRET_ACCESS_TOKEN, {
      expiresIn: '18h',
    });

    return res.status(200).json({
      message: 'Login success',
      status: 200,
      data: {
        data: {
          firstname: statement.firstname,
          lastname: statement.lastname,
          email: email,
        },
        token: token,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Internal error',
      status: 500,
    });
  }
};

module.exports = {
  register,
  registerAdmin,
  login,
};
