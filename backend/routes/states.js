const express = require('express');
const { docClient } = require('../database');

const router = express.Router();

// Get all maps for a user
router.get('/user-maps/:uid', async (req, res) => {
  const { uid } = req.params;
  
  try {
    const result = await docClient.query({
      TableName: 'UserMaps',
      KeyConditionExpression: 'uid = :uid',
      ExpressionAttributeValues: {
        ':uid': uid
      }
    }).promise();
    
    res.json({ maps: result.Items || [] });
  } catch (err) {
    console.error('Error fetching user maps:', err);
    res.status(500).json({ message: 'Error fetching maps' });
  }
});

// Get specific map data
router.get('/map/:uid/:mapId', async (req, res) => {
  const { uid, mapId } = req.params;
  
  try {
    const result = await docClient.get({
      TableName: 'UserMaps',
      Key: { uid, mapId }
    }).promise();
    
    if (!result.Item) {
      return res.status(404).json({ message: 'Map not found' });
    }
    
    res.json({ 
      map: result.Item,
      states: result.Item.states || [],
      customTitle: result.Item.mapTitle
    });
  } catch (err) {
    console.error('Error fetching map:', err);
    res.status(500).json({ message: 'Error fetching map' });
  }
});

// Create new map
router.post('/user-maps', async (req, res) => {
  const { uid, mapTitle } = req.body;
  
  if (!uid || !mapTitle) {
    return res.status(400).json({ message: 'UID and map title are required' });
  }
  
  try {
    // Generate map ID using timestamp + random
    const mapId = `map_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await docClient.put({
      TableName: 'UserMaps',
      Item: {
        uid,
        mapId,
        mapTitle,
        states: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }).promise();
    
    console.log('New map created:', mapTitle, 'for user:', uid);
    res.json({ 
      message: 'Map created successfully',
      mapId,
      mapTitle
    });
  } catch (err) {
    console.error('Error creating map:', err);
    res.status(500).json({ message: 'Error creating map' });
  }
});

// Update map (states and/or title)
router.put('/map/:uid/:mapId', async (req, res) => {
  const { uid, mapId } = req.params;
  const { states, mapTitle } = req.body;
  
  try {
    const updateExpression = [];
    const expressionAttributeValues = {};
    const expressionAttributeNames = {};
    
    if (states !== undefined) {
      updateExpression.push('#states = :states');
      expressionAttributeNames['#states'] = 'states';
      expressionAttributeValues[':states'] = states;
    }
    
    if (mapTitle !== undefined) {
      updateExpression.push('mapTitle = :mapTitle');
      expressionAttributeValues[':mapTitle'] = mapTitle;
    }
    
    updateExpression.push('updatedAt = :updatedAt');
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();
    
    await docClient.update({
      TableName: 'UserMaps',
      Key: { uid, mapId },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: Object.keys(expressionAttributeNames).length > 0 ? expressionAttributeNames : undefined
    }).promise();
    
    console.log('Map updated successfully:', mapId);
    res.json({ message: 'Map updated successfully' });
  } catch (err) {
    console.error('Error updating map:', err);
    res.status(500).json({ message: 'Error updating map' });
  }
});

// Delete map
router.delete('/map/:uid/:mapId', async (req, res) => {
  const { uid, mapId } = req.params;
  
  try {
    await docClient.delete({
      TableName: 'UserMaps',
      Key: { uid, mapId }
    }).promise();
    
    console.log('Map deleted successfully:', mapId);
    res.json({ message: 'Map deleted successfully' });
  } catch (err) {
    console.error('Error deleting map:', err);
    res.status(500).json({ message: 'Error deleting map' });
  }
});

module.exports = router;