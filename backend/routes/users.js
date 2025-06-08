const express = require('express');
const { docClient } = require('../database');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  
//check if email already exists
  try {

const existingUser = await docClient.query({
      TableName: 'Users',
      IndexName: 'EmailIndex',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email
      }
    }).promise();

    if (existingUser.Items.length > 0) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    // auto generate uid
    const uid = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    await docClient.put({
      TableName: 'Users',
      Item: { uid, email, password, name, createdAt: new Date().toISOString() }
    }).promise();


    //default map for new user
const defaultMapId = `map_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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

    console.log('User created successfully:', { uid, });
    res.json({ message: 'User created successfully!',  user: { uid, email, name } });
  } catch (err) {
    res.status(400).json({ message: 'Error creating user' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const result = await docClient.get({
      TableName: 'Users',
      IndexName: 'EmailIndex',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email}
    }).promise();
    
    if (!result.Item || result.Item.password !== password || result.Items.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const user = result.Item[0];
    res.json({ message: 'Login successful!', user: { uid: user.uid, email: user.email, name: user.name } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;