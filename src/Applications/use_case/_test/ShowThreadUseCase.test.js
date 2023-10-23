const ShowThreadUseCase = require('../ShowThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('showThreadUseCase', () => {
  it('should orchestrating the show thread action correctly', async () => {
    // Arrange
    const useCasePayload = 'thread-123';
    const expectedThread = {
      id: 'thread-123',
      title: 'Dicoding Thread',
      body: 'Dicoding is good',
      username: 'user-123',
      date: '2023-10-23T01:30:51Z',
    };
    const expectedComments = [
      {
        id: 'comment-123',
        username: 'user-123',
        date: '2021-08-08T07:26:17.018Z',
        content: 'Comment Thread',
        is_delete: false,
      },
      {
        id: 'comment-124',
        username: 'user-123',
        date: '2021-08-08T07:26:17.018Z',
        content: 'Comment Thread',
        is_delete: true,
      },
    ];
    const expectedShownThread = {
      id: 'thread-123',
      title: 'Dicoding Thread',
      body: 'Dicoding is good',
      date: '2023-10-23T01:30:51Z',
      username: 'user-123',
      comments: [
        {
          id: 'comment-123',
          username: 'user-123',
          date: '2021-08-08T07:26:17.018Z',
          content: 'Comment Thread',
        },
        {
          id: 'comment-124',
          username: 'user-123',
          date: '2021-08-08T07:26:17.018Z',
          content: '**komentar telah dihapus**',
        },
      ],
    };
    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThread));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedComments));
    /** creating use case instance */
    const showThreadUseCase = new ShowThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });
    // Action
    const showThread = await showThreadUseCase.execute(useCasePayload);
    // Assert
    expect(showThread).toStrictEqual(expectedShownThread);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCasePayload);
  })
})
