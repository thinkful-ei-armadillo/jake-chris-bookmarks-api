'use strict';
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
// const { bookmarks } = require('./store');
const uuid = require('uuid/v4'); 
const { NODE_ENV } = require('./config');

const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(express.json());
app.use(cors());
app.use(helmet());

// app.use(function validateBearerToken(req, res, next) {
//   const apiToken = process.env.API_TOKEN;
//   const authToken = req.get('Authorization');

//   if (!authToken || authToken.split(' ')[1] !== apiToken) {
//     // logger.error(`Unauthorized request to path: ${req.path}`);
//     return res.status(401).json({ error: 'Unauthorized request' });
//   }
//   // move to the next middleware
//   next();
// });

const bookmarks = [
  {
    id:1,
    title:'google',
    description:'search engine',
    link:'https://google.com'
  }
];

// /bookmarks/ 
//GET bookmarks
app.get('/bookmarks', (req, res) => {
  res.send(bookmarks);
});

app.get('/bookmarks/:id', (req, res) => {
  const { id } = req.params;
  const bookmark = bookmarks.find(b => b.id == id);
  if(!bookmark){
    return res.status(404)
      .send('Bookmark not found');
  }
  res.status(200).send(bookmark); 
});

app.post('/bookmarks', (req, res) =>{

  const { title, description, link } = req.body;
  
  if (!title) {
    res.status(400).send('Please include title.'); 
  }
  
  if (!description) {
    res.status(400).send('Please include description.'); 
  } 
  
  if (!link) {
    res.status(400).send('Please include link.'); 
  }

  const id = uuid(); 

  const bookmark ={
    id,
    title,
    description,
    link
  };

  bookmarks.push(bookmark); 
  
  res.status(201).location(`http://localhost:8001/bookmarks/${id}`).json(bookmark); 
});

app.delete('/bookmarks/:id', (req, res) => {
  const { id } = req.params; 
  const index = bookmarks.findIndex(b => b.id == id); 

  if (index === -1){
    return res.status(404).send('Bookmark not found');
  }

  bookmarks.splice(index, 1);
  
  res.status(204).send('Bookmark deleted').end(); 
});

// placeholder response for / location
app.get('/', (req,res) => {
  res.send('Hello, world!');
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  }
  else {
    console.error(error);
    response = {message: error.message, error};
  }
  res.status(500).json(response);
});

module.exports = app;