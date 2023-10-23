const CreateComment = require('../../../Domains/comments/entities/CreateComment');
const CreatedComment = require('../../../Domains/comments/entities/CreatedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddCommentUseCase = require('../AddCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      content: 'Thread Comment',
      owner: 'user-123',
    };
    const mockCreatedComment = new CreatedComment({
      id: 'comment-123',
      content: 'Thread Comment',
      owner: 'user-123',
    });
    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    /** mocking needed function */
    mockThreadRepository.verifyThreadIsExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.createComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockCreatedComment));
    /** creating use case instance */
    const getCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });
    // Action
    const createdComment = await getCommentUseCase.execute(useCasePayload);
    // Assert
    expect(createdComment).toStrictEqual(new CreatedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    }));
    expect(mockCommentRepository.createComment).toBeCalledWith(new CreateComment({
      threadId: useCasePayload.threadId,
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    }));
  });
});
