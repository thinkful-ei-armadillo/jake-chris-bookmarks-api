'use strict';

const express = require('express');
const bookmarkRouter = express.Router();
const uuid = require('uuid/v4');
const bodyParser = express.json();
const { bookmarks } = require('../store.js');

bookmarkRouter  
  .route('/bookmarks')
  .get((req, res) => {
    res.json(bookmarks);
  })
  .post(bodyParser, (req, res) =>{

    const { title, description, link } = req.body;
    
    if (!title) {
      return res.status(400).send('Please include title.'); 
    }
    
    if (!description) {
      return res.status(400).send('Please include description.'); 
    } 
    
    if (!link) {
      return res.status(400).send('Please include link.'); 
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

bookmarkRouter
  .route('/bookmarks/:id')
  .get((req, res) => {
    const { id } = req.params;
    const bookmark = bookmarks.find(b => b.id == id);
    if(!bookmark){
      return res.status(404)
        .send('Bookmark not found');
    }
    res.status(200).send(bookmark); 
  })
  .delete((req, res) => {
    const { id } = req.params; 
    const index = bookmarks.findIndex(b => b.id == id); 
  
    if (index === -1){
      return res.status(404).send('Bookmark not found');
    }
  
    bookmarks.splice(index, 1);
    
    res.status(204).end(); 
  });

module.exports = bookmarkRouter; 