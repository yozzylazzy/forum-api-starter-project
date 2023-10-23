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
      await server.inject({
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
      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'Dicoding Thread',
          body: 'Dicoding is good',
        },
        headers: { Authorization: `Bearer ${auth.accessToken}` }
      })
      const { id: threadId } = JSON.parse(thread.payload);
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
      await server.inject({
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
      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'Dicoding Thread',
          body: 'Dicoding is good',
        },
        headers: { authorization: `Bearer ${auth.accessToken}` }
      })
      const { id: threadId } = JSON.parse(thread.payload);
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
      await server.inject({
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
      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'Dicoding Thread',
          body: 'Dicoding is good',
        },
        headers: { authorization: `Bearer ${auth.accessToken}` }
      })
      const threadResponse = JSON.parse(thread.payload);
      const threadId = threadResponse.data.addedThread.id;
      console.log(threadId);
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
});