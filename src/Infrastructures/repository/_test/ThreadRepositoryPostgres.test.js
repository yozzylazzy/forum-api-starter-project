const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });
  afterAll(async () => {
    await pool.end();
  });
  describe('addThread function', () => {
    it('should persist create thread', async () => {
      // Arrange
      const createThread = new CreateThread({
        title: 'Dicoding Thread',
        body: 'Dicoding is ...',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      // Action
      await threadRepositoryPostgres.addThread(createThread);
      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById('thread-123');
      expect(threads).toHaveLength(1);
    });
    it('should return created thread correctly', async () => {
      // Arrange
      const createThread = new CreateThread({
        title: 'Dicoding Title',
        body: 'Dicoding is ...',
        owmer: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const createdThread = await threadRepositoryPostgres.addUser(createThread);

      // Assert
      expect(createdThread).toStrictEqual(new CreatedThread({
        id: 'thread-123',
        title: 'Dicodign Title',
        body: 'Dicoding is ...',
        owner: 'user-123',
      }));
    });
  });
});
