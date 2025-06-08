const express = require('express');
const { docClient } = require('../database');

const router = express.Router();

// Get visited states for a user
router.get('/visited-states/:email', async (req, res) => {
  const { email } = req.params;
  
  try {
    const result = await docClient.get({
      TableName: 'UserStates',
      Key: { email }
    }).promise();
    
    res.json({ states: result.Item ? result.Item.states : [],   customTitle: result.Item ? result.Item.customTitle : null
 });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching states' });
  }
});

// Save visited states
router.post('/visited-states', async (req, res) => {
  const { email, states } = req.body;
  console.log('Saving states for:', email, states);
  
  try {
    await docClient.put({
      TableName: 'UserStates',
      Item: { 
        email, 
        states,
          customTitle: req.body.customTitle,
        updatedAt: new Date().toISOString()
      }
    }).promise();
    
    console.log('States saved successfully for:', email);
    res.json({ message: 'States saved successfully' });
  } catch (err) {
    console.error('Error saving states:', err);
    res.status(500).json({ message: 'Error saving states' });
  }
});

module.exports = router;