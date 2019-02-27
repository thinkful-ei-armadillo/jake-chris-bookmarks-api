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
  .post(bodyParser, (req, res, next) => {
    const { title, url, rating, description } = req.body;
    const bookmark = {
      title,
      url,
      description,
      rating
    };
    BookmarkService.insertArticle(req.app.get('db'), bookmark)
      .then(bookmark => {
        res
          .status(201)
          .location(`http://localhost:8001/bookmarks/${bookmark.id}`)
          .json(bookmark);
      })
      .catch(error => {
        console.log(error);
        next();
      });
  });

bookmarkRouter
  .route('/bookmarks/:id')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    BookmarkService.getById(knexInstance, req.params.id)
      .then(bookmarks => {
        if (!bookmarks) {
          return res.status(404).json({
            error: { message: "Bookmark doesn't exist" }
          });
        }
        console.log(bookmarks);
        res.json(bookmarks);
      })
      .catch(next);
  })

  .delete((req, res, next) => {
    BookmarkService.deleteArticle(req.app.get('db'), req.params.id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = bookmarkRouter;
