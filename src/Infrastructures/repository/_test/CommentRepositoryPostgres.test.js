// Table Helper
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
// Domains
const CreateComment = require('../../../Domains/comments/entities/CreateComment');
const CreatedComment = require('../../../Domains/comments/entities/CreatedComment');
// Postgres
const pool = require('../../database/postgres/pool');
// Infrastructure
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });
  afterAll(async () => {
    await pool.end();
  });

  describe('createComment function', () => {
    it('should persist create comment and return created comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      const createComment = new CreateComment({
        content: 'Thread Comment',
        owner: 'user-123',
        threadId: 'thread-123',
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      // Action
      const createdComment = await commentRepositoryPostgres.createComment(createComment);
      // Assert
      const comments = await CommentsTableTestHelper.findCommentById(createdComment.id);
      expect(comments).toHaveLength(1);
      expect(createdComment).toStrictEqual(new CreatedComment({
        id: 'comment-123',
        content: createComment.content,
        owner: createComment.owner,
      }));
    });
  });

  describe('verifyCommentExist function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentExist('comment-1212'))
        .rejects.toThrowError(NotFoundError);
    });
    it('should not throw NotFoundError when comment found', async () => {
      // Arrange
      const commentId = 'comment-123';
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        owner: 'user-123',
        threadId: 'thread-123',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentExist(commentId))
        .resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw UnauthorizedError when provided userId is not the comment owner', async () => {
      // Arrange
      const commentId = 'comment-123';
      const userId = 'user-123';
      const userTwoId = 'user-456';
      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        owner: 'user-123',
        threadId: 'thread-123',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner(commentId, userTwoId))
        .rejects.toThrowError(AuthorizationError);
    });
    it('should verify the comment owner correctly', async () => {
      // Arrange
      const commentId = 'comment-123';
      const userId = 'user-123';
      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        owner: 'user-123',
        threadId: 'thread-123',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner(commentId, userId))
        .resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('deleteComment function', () => {
    it('should persist delete comment and delete comment succesfully', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      const requestPayload = {
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      };
      const commentRepository = new CommentRepositoryPostgres(pool);
      await CommentsTableTestHelper.addComment({
        id: requestPayload.id,
        threadId: requestPayload.threadId,
        owner: requestPayload.owner,
      });
      // Action
      await commentRepository.deleteCommentById(requestPayload.id);
      // Assert
      const comments = await CommentsTableTestHelper.findCommentById(requestPayload.id);
      expect(comments).toHaveLength(0);
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should persist get comments by thread id and return all comments found by thread id', async () => {
      // Arrange
      const threadId = 'thread-123';
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: threadId });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId,
        date: '2023-10-23T16:37:32Z',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-456',
        threadId,
        date: '2023-10-23T17:37:32Z',
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId(threadId);
      // Assert
      expect(comments).toBeDefined();
      expect(comments).toHaveLength(2);
      expect(comments[0].id).toEqual('comment-123');
      expect(comments[0].date).toEqual('2023-10-23T16:37:32Z');
      expect(comments[0].username).toEqual('dicoding');
      expect(comments[0].content).toEqual('Thread Comment');
      expect(comments[0].is_delete).toEqual(false);
      expect(comments[1].id).toEqual('comment-456');
      expect(comments[1].date).toEqual('2023-10-23T17:37:32Z');
      expect(comments[1].username).toEqual('dicoding');
      expect(comments[1].content).toEqual('Thread Comment');
      expect(comments[1].is_delete).toEqual(false);
    });
  });
});
