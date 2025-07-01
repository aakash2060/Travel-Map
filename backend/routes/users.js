const express = require('express');
const { docClient } = require('../database');

const router = express.Router();

router.post('/register', async (req, res) => {
      console.log('Registration request received:', req.body);
  const { email, password, name } = req.body;
  
  try {
    console.log('Checking if email exists:', email);

const existingUser = await docClient.query({
      TableName: 'Users',
      IndexName: 'EmailIndex',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email
      }
    }).promise();

        console.log('Existing user query result:', existingUser);

    if (existingUser.Items.length > 0) {
              console.log('User already exists');

      return res.status(409).json({ message: 'User with this email already exists' });
    }

    const uid = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        console.log('Generated UID:', uid);


    await docClient.put({
      TableName: 'Users',
      Item: { uid, email, password, name, createdAt: new Date().toISOString() }
    }).promise();
    console.log('User created successfully');


    //default map for new user
const defaultMapId = `map_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log('Creating default map with ID:', defaultMapId);

    await docClient.put({
      TableName: 'UserMaps',
      Item: {
        uid,
        mapId: defaultMapId,
        mapTitle: 'My Travel Map',
        states: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }).promise();

        console.log('Default map created successfully');
    console.log('User created successfully:', { uid, });
    res.json({ message: 'User created successfully!',  user: { uid, email, name } });
  } catch (err) {
        console.error('Registration error:', err);
    res.status(400).json({ message: 'Error creating user' });
  }
});

router.post('/login', async (req, res) => {
     console.log('Login request received:', { email: req.body.email });
  const { email, password } = req.body;

    if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  
  try {
    const result = await docClient.query({
      TableName: 'Users',
      IndexName: 'EmailIndex',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email}
    }).promise();
        console.log('Login query result:', result);

    
    if (result.Items.length === 0) {
  console.log('User not found');
  return res.status(401).json({ message: 'Invalid credentials' });
}

const user = result.Items[0];

if (user.password !== password) {
  console.log('Password mismatch');
  return res.status(401).json({ message: 'Invalid credentials' });
}
     console.log('Login successful for UID:', user.uid);
    res.json({ message: 'Login successful!', user: { uid: user.uid, email: user.email, name: user.name } });
  } catch (err) {
     console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;