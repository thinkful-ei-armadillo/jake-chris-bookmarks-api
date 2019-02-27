'use strict';

const express = require('express');
const bookmarkRouter = express.Router();
const uuid = require('uuid/v4');
const bodyParser = express.json();
const { bookmarks } = require('../src/store');
const BookmarkService = require('./bookmark-service'); 

bookmarkRouter  
  .route('/bookmarks')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    BookmarkService.getAllBookmarks(knexInstance)
      .then(bookmarks => {
        res.json(bookmarks); 
      })
      .catch(next); 
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
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    BookmarkService.getById(knexInstance, req.params.id)
      .then(bookmarks => {
        if (!bookmarks) {
          return res.status(404).json({
            error: { message: 'Bookmark doesn\'t exist' }
          });
        }
        console.log(bookmarks);
        res.json(bookmarks);
      })
      .catch(next);
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