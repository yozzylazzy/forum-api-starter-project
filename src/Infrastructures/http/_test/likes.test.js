const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments/{commentId}/likes ... endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when PUT /threads/{threadId}/comments', () => {
    it('should response 200 and persisted like', async () => {
      // Arrange
      const server = await createServer(container);
      const userResponse = await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Coding',
        },
      });
      const authReponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const { data: auth } = JSON.parse(authReponse.payload);
      const { data: user } = JSON.parse(userResponse.payload);
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        owner: user.addedUser.id,
      });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        threadId,
        owner: user.addedUser.id,
      });
      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          authorization: `Bearer ${auth.accessToken}`,
        },
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 404 when comment does not exist', async () => {
      // Arrange
      const server = await createServer(container);
      const userResponse = await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Coding',
        },
      });
      const authReponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const threadId = 'thread-456';
      const commentId = 'comment-456';
      const { data: auth } = JSON.parse(authReponse.payload);
      const { data: user } = JSON.parse(userResponse.payload);
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        owner: user.addedUser.id,
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: user.addedUser.id,
      });
      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });
});
