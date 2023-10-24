const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('DeleteCommentUseCase', () => {
  it('should throw error if use case payload not meet data type specification', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 123,
      owner: { id: 'user-123' },
      commentId: 12.3,
    };
    const deleteCommentUseCase = new DeleteCommentUseCase({});
    // Action & Assert
    await expect(deleteCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should throw error if payload not contain needed payload', async () => {
    // Arrange
    const useCasePayload = {
      owner: 'user-123'
    };
    const deleteCommentUseCase = new DeleteCommentUseCase(useCasePayload);
    // Action & Assert
    await expect(deleteCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PAYLOAD');
  });
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };
    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    /** mocking needed function */
    mockThreadRepository.verifyThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    /** creating use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });
    // Action
    await deleteCommentUseCase.execute(useCasePayload);
    // Assert
    expect(mockThreadRepository.verifyThreadExist)
      .toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentExist)
      .toBeCalledWith(useCasePayload.commentId);
    expect(mockCommentRepository.verifyCommentOwner)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
    expect(mockCommentRepository.deleteCommentById)
      .toBeCalledWith(useCasePayload.commentId);
  });
});
