const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
// Domains
const CreatedReply = require('../../../Domains/replies/entities/CreatedReply');
const CreateReply = require('../../../Domains/replies/entities/CreateReply');
// Postgres
const pool = require('../../database/postgres/pool');
// Infrastructure
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
// Error
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });
  afterAll(async () => {
    await pool.end();
  });

  describe('createReply function', () => {
    it('should persist create reply and return created reply correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      const createReply = new CreateReply({
        content: 'Thread Comment',
        owner: 'user-123',
        commentId: 'comment-123',
      });
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      // Action
      const createdReply = await replyRepositoryPostgres.createReply(createReply);
      // Assert
      const replies = await RepliesTableTestHelper.findRepliesById(createdReply.id);
      expect(replies).toHaveLength(1);
      expect(createdReply).toStrictEqual(new CreatedReply({
        id: 'reply-123',
        content: createReply.content,
        owner: createReply.owner,
      }));
    });
  });

  describe('getRepliesByThreadId function', () => {
    it('should return replies by thread id correctly', async () => {
      // Arrange
      const threadId = 'thread-123';
      const replyData = {
        id: 'reply-123',
        content: 'Reply content',
        owner: 'user-123',
        commentId: 'comment-123',
        date: 'fake date',
      };
      const userData = {
        id: 'user-123',
        username: 'the-username',
      };
      await UsersTableTestHelper.addUser(userData); // add user with id user-123
      await ThreadsTableTestHelper.addThread({ id: threadId }); // add thread with id thread-123
      await CommentsTableTestHelper.addComment({ id: 'comment-123' }); // add comment with id comment-123
      await RepliesTableTestHelper.addReplies(replyData); // add reply with id reply-123
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const repliesByThreadId = await replyRepositoryPostgres.getRepliesByThreadId(threadId);

      // Assert
      expect(repliesByThreadId).toBeDefined();
      expect(repliesByThreadId).toHaveLength(1);
      expect(repliesByThreadId[0]).toHaveProperty('id');
      expect(repliesByThreadId[0].id).toEqual(replyData.id);
      expect(repliesByThreadId[0]).toHaveProperty('content');
      expect(repliesByThreadId[0].content).toEqual(replyData.content);
      expect(repliesByThreadId[0]).toHaveProperty('date');
      expect(repliesByThreadId[0].date).toEqual(replyData.date);
      expect(repliesByThreadId[0]).toHaveProperty('username');
      expect(repliesByThreadId[0].username).toEqual(userData.username);
      expect(repliesByThreadId[0]).toHaveProperty('comment_id');
      expect(repliesByThreadId[0].comment_id).toEqual(replyData.commentId);
      expect(repliesByThreadId[0]).toHaveProperty('is_delete');
      expect(repliesByThreadId[0].is_delete).toEqual(false); // default value in helper
    });
  });

  describe('verifyReplyExist function', () => {
    it('should throw NotFoundError when reply not found', () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(replyRepositoryPostgres.verifyReplyExist('hello-world'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when reply found', async () => {
      // Arrange
      const replyId = 'reply-123';
      await UsersTableTestHelper.addUser({ id: 'user-123' }); // add user with id user-123
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' }); // add thread with id thread-123
      await CommentsTableTestHelper.addComment({ id: 'comment-123' }); // add comment with id comment-123
      await RepliesTableTestHelper.addReplies({ id: replyId }); // add reply with id reply-123
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(replyRepositoryPostgres.verifyReplyExist(replyId))
        .resolves
        .not
        .toThrowError(NotFoundError);
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should throw UnauthorizedError when provided userId is not the reply owner', async () => {
      // Arrange
      const commentId = 'comment-123';
      const replyId = 'reply-123';
      const userId = 'user-123';
      const wrongUserId = 'user-456';
      await UsersTableTestHelper.addUser({ id: userId }); // add user with id user-123
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' }); // add thread with id thread-123
      await CommentsTableTestHelper.addComment({ // add comment with id comment-123
        id: commentId,
      });
      await RepliesTableTestHelper.addReplies({ // add reply with id reply-123
        id: replyId, owner: userId, commentId,
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      expect(replyRepositoryPostgres.verifyReplyOwner(replyId, wrongUserId))
        .rejects.toThrowError(AuthorizationError);
    });

    it('should verify the reply owner correctly', async () => {
      // Arrange
      const commentId = 'comment-123';
      const replyId = 'reply-123';
      const userId = 'user-123';
      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: userId });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        threadId: 'thread-123',
        owner: userId,
      });
      await RepliesTableTestHelper.addReplies({
        id: replyId, owner: userId, commentId,
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      // Action & Assert
      expect(replyRepositoryPostgres.verifyReplyOwner(replyId, userId))
        .resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('deleteReplyById function', () => {
    it('should throw NotFoundError when reply not found', () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(replyRepositoryPostgres.deleteReplyById('hello-world'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should delete reply by id and return success correctly', async () => {
      // Arrange
      const commentId = 'comment-123';
      const replyId = 'reply-123';
      await UsersTableTestHelper.addUser({ id: 'user-123' }); // add user with id user-123
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' }); // add thread with id thread-123
      await CommentsTableTestHelper.addComment({ // add comment with id comment-123
        id: commentId,
      });
      await RepliesTableTestHelper.addReplies({ id: replyId, owner: 'user-123', commentId }); // add reply with id reply-123
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      await replyRepositoryPostgres.deleteReplyById(replyId);

      // Assert
      const replies = await RepliesTableTestHelper.findRepliesById(replyId);
      expect(replies).toHaveLength(1);
      expect(replies[0].is_delete).toEqual(true);
    });
  });
});
