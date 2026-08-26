const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d',
  });
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log(`[DEBUG] Attempting to register user: ${email}`);
    console.log(`[DEBUG] Database name: ${User.db.name}`);
    console.log(`[DEBUG] Collection name: ${User.collection.name}`);

    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log(`[DEBUG] User already exists with ID: ${userExists._id}`);
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    console.log(`[DEBUG] User created successfully with ID: ${user._id}`);
    console.log(`[DEBUG] User saved to collection: ${User.collection.name}`);

    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    console.log(`[DEBUG] Registration error: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(`[DEBUG] Attempting login for: ${email}`);
    console.log(`[DEBUG] Database name: ${User.db.name}`);
    console.log(`[DEBUG] Collection name: ${User.collection.name}`);

    const user = await User.findOne({ email });
    if (!user) {
      console.log(`[DEBUG] User not found`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log(`[DEBUG] User found with ID: ${user._id}`);

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    console.log(`[DEBUG] Login error: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login };
