const AddCancelLikeUseCase = require('../AddCancelLikeUseCase');
const CreateLike = require('../../../Domains/likes/entities/CreateLike');
const CreatedLike = require('../../../Domains/likes/entities/CreatedLike');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddCancelLikeUseCase', () => {
  it('should orchestrating the add like action correctly', async () => {
    // Arrange
    const useCasePayload = {
      owner: 'user-123',
      commentId: 'comment-123',
    };
    const mockCreatedLike = new CreatedLike({
      id: 'like-123',
      owner: 'user-123',
      commentId: 'comment-123',
    });
    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();
    /** mocking needed function */
    mockThreadRepository.verifyThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.verifyIsLiked = jest.fn()
      .mockImplementation(() => Promise.resolve(false));
    mockLikeRepository.createLike = jest.fn()
      .mockImplementation(() => Promise.resolve(mockCreatedLike));
    /** creating use case instance */
    const getLikeUseCase = new AddCancelLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });
    // Action
    const createdLike = await getLikeUseCase.execute(useCasePayload);
    // Assert
    expect(mockThreadRepository.verifyThreadExist)
      .toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentExist)
      .toBeCalledWith(useCasePayload.commentId);
    expect(mockLikeRepository.verifyIsLiked)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
    expect(createdLike).toStrictEqual(new CreatedLike({
      id: 'like-123',
      owner: useCasePayload.owner,
      commentId: useCasePayload.commentId,
    }));
    expect(mockLikeRepository.createLike).toBeCalledWith(new CreateLike({
      owner: useCasePayload.owner,
      commentId: useCasePayload.commentId,
    }));
  });

  it('should orhectrating the cancel like action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'like-123',
      owner: 'user-123',
      commentId: 'comment-123',
      threadId: 'thread-123',
    };
    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();
    /** mocking needed function */
    mockThreadRepository.verifyThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.verifyIsLiked = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockLikeRepository.cancelLike = jest.fn()
      .mockImplementation(() => Promise.resolve());
    /** creating use case instance */
    const addCancelLikeUseCase = new AddCancelLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });
    // Action
    await addCancelLikeUseCase.execute(useCasePayload);
    // Assert
    expect(mockThreadRepository.verifyThreadExist)
      .toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentExist)
      .toBeCalledWith(useCasePayload.commentId);
    expect(mockLikeRepository.verifyIsLiked)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
    expect(mockLikeRepository.cancelLike)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
  });
});
