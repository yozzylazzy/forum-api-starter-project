const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('createThread function', () => {
    it('should persist create thread and return created thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      const createThread = new CreateThread({
        title: 'Thread Title',
        body: 'Thread body',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      // Action
      const createdThread = await threadRepositoryPostgres.createThread(createThread);
      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById(createdThread.id);
      expect(threads).toHaveLength(1);
      expect(createdThread).toStrictEqual(new CreatedThread({
        id: 'thread-123',
        title: createThread.title,
        owner: createThread.owner,
      }));
    });
  });

  describe('verifyThreadExist function', () => {
    it('should persist verify thread exist', async () => {
      // Arrange
      const threadId = 'thread-123';
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: threadId });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadExist(threadId))
        .resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('getThreadById function', () => {
    it('should persist thread by threadId and return detail thread correctly', async () => {
      // Arrange
      const requestPayload = {
        id: 'thread-123',
        title: 'Dicoding Thread',
        body: 'Dicoding is good',
        owner: 'user-123',
        date: 'thread date',
      };
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread(requestPayload);
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      // Action
      const thread = await threadRepositoryPostgres.getThreadById(requestPayload.id);
      // Assert
      expect(thread).toBeDefined();
      expect(thread.id).toEqual(requestPayload.id);
      expect(thread.title).toEqual(requestPayload.title);
      expect(thread.body).toEqual(requestPayload.body);
      expect(thread.owner).toEqual(requestPayload.owner);
      expect(thread.date).toEqual(requestPayload.date);
    });
  });
});
