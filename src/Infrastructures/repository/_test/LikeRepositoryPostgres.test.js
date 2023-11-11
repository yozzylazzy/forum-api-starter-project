// Table Helper
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
// Domains
const CreateLike = require('../../../Domains/likes/entities/CreateLike');
const CreatedLike = require('../../../Domains/likes/entities/CreatedLike');
// Postgres
const pool = require('../../database/postgres/pool');
// Infrastructure
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
// Error
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('LikeRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await LikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('createLike function', () => {
    it('should persist create like correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      const createLike = new CreateLike({
        owner: 'user-123',
        commentId: 'comment-123',
      });
      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);
      // Action
      // console.log(createLike);
      const createdLike = await likeRepositoryPostgres.createLike(createLike);
      // Assert
      const likes = await LikesTableTestHelper.findLikeById(createdLike.id);
      expect(likes).toHaveLength(1);
    });
  });

  describe('verifyIsLiked function', () => {
    it('should return true if comment was liked', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await LikesTableTestHelper.addLike({ id: 'like-123' });
      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);
      // Action
      const isLiked = await likeRepositoryPostgres.verifyIsLiked('comment-123', 'user-123');
      // Assert
      expect(isLiked).toBeDefined();
      expect(isLiked).toStrictEqual(true);
    });

    it('should return false if comment wasnt liked', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
      // Action
      const isLiked = await likeRepositoryPostgres.verifyIsLiked('comment-123', 'user-123');
      // Assert
      expect(isLiked).toBeDefined();
      expect(isLiked).toStrictEqual(false);
    });
  });

  describe('cancelLike funtion', () => {
    it('should persist cancel like and cancel like successfully', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      const requestPayload = {
        id: 'like-123',
        owner: 'user-123',
        commentId: 'comment-123',
      };
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool);
      await LikesTableTestHelper.addLike({
        id: requestPayload.id,
        owner: requestPayload.owner,
        commentId: requestPayload.commentId,
      });
      // Action
      await likeRepositoryPostgres.cancelLike(requestPayload.commentId, requestPayload.owner);
      // Assert
      const likes = await LikesTableTestHelper.findLikeById(requestPayload.id);
      expect(likes).toHaveLength(0);
    });
  });

  describe('getLikesCountByCommentId function', () => {
    it('should return total likes by comment id', async () => {
      // Arrange
      const commentId = 'comment-123';
      const userId = 'user-123';
      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: commentId });
      await LikesTableTestHelper.addLike({ owner: userId, commentId });
      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);
      // Action
      const likeCount = await likeRepositoryPostgres.getLikesCountByCommentId(commentId);
      // Assert
      expect(likeCount).toBeDefined();
      expect(likeCount).toEqual(1);
    });
  });
});
