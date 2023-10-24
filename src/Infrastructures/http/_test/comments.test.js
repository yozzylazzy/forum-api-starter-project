const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments/... endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'Thread Comment',
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
      const { data: auth } = JSON.parse(authReponse.payload);
      const { data: user } = JSON.parse(userResponse.payload);
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        owner: user.addedUser.id,
      });
      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          ...requestPayload,
          threadId,
          owner: 'user-123',
        },
        headers: {
          authorization: `Bearer ${auth.accessToken}`,
        },
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
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
      const { data: auth } = JSON.parse(authReponse.payload);
      const { data: user } = JSON.parse(userResponse.payload);
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        owner: user.addedUser.id,
      });
      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${auth.accessToken}`,
        },
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('gagal untuk membuat/menambahkan comment karena data tidak lengkap');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = { content: 123 };
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
      const { data: auth } = JSON.parse(authReponse.payload);
      const { data: user } = JSON.parse(userResponse.payload);
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        owner: user.addedUser.id,
      });
      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${auth.accessToken}`,
        },
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('gagal untuk membuat/menambahkan comment karena tipe data tidak sesuai');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 201 and delete comment correctly', async () => {
      // Arrange
      const requestPayload = {
        commentId: 'comment-123',
        threadId: 'thread-123',
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
      const { data: auth } = JSON.parse(authReponse.payload);
      const { data: user } = JSON.parse(userResponse.payload);
      await ThreadsTableTestHelper.addThread({
        id: requestPayload.threadId,
        owner: user.addedUser.id,
      });
      await CommentsTableTestHelper.addComment({
        id: requestPayload.commentId,
        threadId: requestPayload.threadId,
        owner: user.addedUser.id,
      });
      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${requestPayload.threadId}/comments/${requestPayload.commentId}`,
        headers: {
          authorization: `Bearer ${auth.accessToken}`,
        },
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });

  it('should response 403 when user is not an authorized owner of the comment', async () => {
    // Arrange
    const requestPayload = {
      commentId: 'comment-123',
      threadId: 'thread-123',
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
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'yosef',
        password: 'supersecret',
        fullname: 'Yosef Coding',
      },
    });
    const authTwoResponse = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: 'yosef',
        password: 'supersecret',
      },
    });
    const { data: user } = JSON.parse(userResponse.payload);
    const { data: authTwo } = JSON.parse(authTwoResponse.payload);
    await ThreadsTableTestHelper.addThread({
      id: requestPayload.threadId,
      owner: user.addedUser.id,
    });
    await CommentsTableTestHelper.addComment({
      id: requestPayload.commentId,
      threadId: requestPayload.threadId,
      owner: user.addedUser.id,
    });
    // Action
    const response = await server.inject({
      method: 'DELETE',
      url: `/threads/${requestPayload.threadId}/comments/${requestPayload.commentId}`,
      headers: {
        authorization: `Bearer ${authTwo.accessToken}`,
      },
    });
    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(403);
    expect(responseJson.status).toEqual('fail');
    expect(responseJson.message).toEqual('gagal memverifikasi comment dan penulis komentar');
  });

  it('should response 404 when thread or comment doesnt exist', async () => {
    // Arrange
    const requestPayload = {
      commentId: 'comment-456',
      threadId: 'thread-123',
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
    const { data: auth } = JSON.parse(authReponse.payload);
    const { data: user } = JSON.parse(userResponse.payload);
    await ThreadsTableTestHelper.addThread({
      id: requestPayload.threadId,
      owner: user.addedUser.id,
    });
    await CommentsTableTestHelper.addComment({
      id: 'comment-123',
      threadId: requestPayload.threadId,
      owner: user.addedUser.id,
    });
    // Action
    const response = await server.inject({
      method: 'DELETE',
      url: `/threads/${requestPayload.threadId}/comments/${requestPayload.commentId}`,
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
