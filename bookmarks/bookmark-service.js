'use strict';

const BookmarkService = {

  getAllBookmarks(knex){
    return  knex.select('*').from('bookmark_entries');
  },

  insertArticle(knex, newBookmark) {
    return knex
      .insert(newBookmark)
      .into('bookmark_entries')
      .returning('*')
      .then(rows => {
        return rows[0]; 
      }); 
  },

  getById(knex, id) {
    return knex.from('bookmark_entries').select('*').where('id', id).first();
  },

  deleteArticle(knex, id) {
    return knex('bookmark_entries')
      .where({ id })
      .delete();
  }, 

  updateArticle(knex, id, newBookmarkFields) {
    return knex('bookmark_entries')
      .where({ id })
      .update(newBookmarkFields);
  },

};

module.exports = BookmarkService; 