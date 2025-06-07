const express = require('express');
const { docClient } = require('../database');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  
  try {
    await docClient.put({
      TableName: 'Users',
      Item: { email, password, name }
    }).promise();
    res.json({ message: 'User created successfully!' });
  } catch (err) {
    res.status(400).json({ message: 'Error creating user' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const result = await docClient.get({
      TableName: 'Users',
      Key: { email }
    }).promise();
    
    if (!result.Item || result.Item.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    res.json({ message: 'Login successful!', user: { email, name: result.Item.name } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;