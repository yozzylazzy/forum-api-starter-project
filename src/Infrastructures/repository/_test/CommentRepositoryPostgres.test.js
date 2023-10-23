// Table Helper
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
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
        content: 'Comment Thread',
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
});