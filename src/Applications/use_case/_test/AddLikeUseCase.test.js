const AddLikeUseCase = require('../AddLikeUseCase');
const CreateLike = require('../../../Domains/likes/entities/CreateLike');
const CreatedLike = require('../../../Domains/likes/entities/CreatedLike');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('AddLikeUseCase', () => {
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
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();
    /** mocking needed function */
    mockCommentRepository.verifyCommentExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.createLike = jest.fn()
      .mockImplementation(() => Promise.resolve(mockCreatedLike));
    /** creating use case instance */
    const getLikeUseCase = new AddLikeUseCase({
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });
    // Action
    const createdLike = await getLikeUseCase.execute(useCasePayload);
    // Assert
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
});
