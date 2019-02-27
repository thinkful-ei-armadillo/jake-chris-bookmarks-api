'use strict';

const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');
const { bookmarksArray } = require('./bookmarks.fixtures');
const supertest = require('supertest');

describe.only('Bookmarks Endpoints', function() {
  let db;

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
    app.set('db', db);
  });


  after('disconnect from db', () => db.destroy());

  before('clean the table', () => db('bookmark_entries').truncate());

  afterEach('cleanup', () => db('bookmark_entries').truncate());

  describe('GET /bookmarks', () => {
    context('Given no bookmarks', () => {
      it('responds with 200 and an empty list', () => {
        return supertest(app)
          .get('/bookmarks')
          .expect(200, []);
      });
    });

    context('Given there are bookmarks in the database', () => {
      const testBookmarks = bookmarksArray;

      beforeEach('insert bookmarks', () => {
        return db.into('bookmark_entries').insert(testBookmarks);
      });

      it('responds with 200 and all of the bookmarks', () => {
        return supertest(app)
          .get('/bookmarks')
          .expect(200, testBookmarks);
      });
    });
  });

  describe('GET /bookmarks/:id', () => {
    context('Given no bookmarks', () => {
      it('responds with 404', () => {
        const Id = 1;
        return supertest(app)
          .get(`/bookmarks/${Id}`)
          .expect(404, { error: { message: "Bookmark doesn't exist" } });
      });
    });

    context('Given there are bookmarks in the database', () => {
      const testBookmark = bookmarksArray;

      beforeEach('insert bookmarks', () => {
        return db.into('bookmark_entries').insert(testBookmark);
      });

      it('responds with 200 and the specified entry', () => {
        const Id = 2;
        const expectedBookmark = testBookmark[Id - 1];
        return supertest(app)
          .get(`/bookmarks/${Id}`)
          .expect(200, expectedBookmark);
      });
    });
  });
});
