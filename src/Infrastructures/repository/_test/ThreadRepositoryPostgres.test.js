// Table Helper
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
// Domains
const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');
// Postgres
const pool = require('../../database/postgres/pool');
// Infrasturture
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
// Error
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
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      // Action & Assert
      return expect(threadRepositoryPostgres.verifyThreadExist('thread-456'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread found', async () => {
      // Arrange
      const threadId = 'thread-123';
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: threadId });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadExist('thread-123'))
        .rejects.not.toThrowError(NotFoundError);
    });
  });

  describe('getThreadById function', () => {
    it('should throw NotFoundError when thread not found', () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      // Action & Assert
      return expect(threadRepositoryPostgres.getThreadById('thread-456'))
        .rejects.toThrowError(NotFoundError);
    });

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
