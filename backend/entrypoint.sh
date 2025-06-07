#!/bin/bash

# Wait until DynamoDB is available
until curl -s http://dynamodb:8000; do
  echo "Waiting for DynamoDB to be available..."
  sleep 2
done

# Start the backend
npm run dev
