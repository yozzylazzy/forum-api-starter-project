const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');

describe('/threads/{threadId}/comments/{commentId}/replies endpoint', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and persisted reply', async () => {
      // Arrange
      const requestPayload = {
        content: 'Reply content',
      };
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
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
    });
    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {};
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
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${auth.accessToken}`,
        },
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('gagal membuat reply karena properti yang dibutuhkan tidak ada');
    });
    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        content: { id: 123 },
      };
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
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${auth.accessToken}`,
        },
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('gagal membuat reply karena tipe data tidak sesuai');
    });
  });
  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 200 and delete reply correctly', async () => {
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
      const replyId = 'reply-123';
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
      await RepliesTableTestHelper.addReplies({
        id: replyId,
        commentId,
        owner: user.addedUser.id,
      });
      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
    it('should response 403 when user is not an authorized owner of the comment', async () => {
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
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'yosef',
          password: 'secretcode',
          fullname: 'Yosef Coding',
        },
      });
      const authReponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'yosef',
          password: 'secretcode',
        },
      });
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';
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
      await RepliesTableTestHelper.addReplies({
        id: replyId,
        commentId,
        owner: user.addedUser.id,
      });
      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          authorization: `Bearer ${auth.accessToken}`,
        },
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('gagal memverifikasi reply dan penulis reply');
    });
    it('should response 404 when thread or comment doesnt exist', async () => {
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
      const replyId = 'reply-456';
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
      await RepliesTableTestHelper.addReplies({
        id: 'reply-123',
        commentId,
        owner: user.addedUser.id,
      });
      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          authorization: `Bearer ${auth.accessToken}`,
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
