const ShowThreadUseCase = require('../ShowThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

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
        content: 'Thread Comment',
        is_delete: false,
      },
      {
        id: 'comment-456',
        username: 'user-123',
        date: '2021-08-08T07:26:17.018Z',
        content: 'Thread Comment',
        is_delete: true,
      },
    ];
    const expectedReplies = [
      {
        id: 'reply-123',
        content: 'reply Content',
        date: '2021-08-08T07:26:17.018Z',
        username: 'user-123',
        is_delete: false,
        comment_id: 'comment-123',
      },
      {
        id: 'reply-456',
        content: 'reply Content 2',
        date: '2021-08-08T07:26:17.018Z',
        username: 'user-123',
        is_delete: true,
        comment_id: 'comment-123',
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
          replies: [
            {
              id: 'reply-123',
              content: 'reply Content',
              date: '2021-08-08T07:26:17.018Z',
              username: 'user-123',
            },
            {
              id: 'reply-456',
              content: '**balasan telah dihapus**',
              date: '2021-08-08T07:26:17.018Z',
              username: 'user-123',
            },
          ],
          content: 'Thread Comment',
        },
        {
          id: 'comment-456',
          username: 'user-123',
          date: '2021-08-08T07:26:17.018Z',
          replies: [],
          content: '**komentar telah dihapus**',
        },
      ],
    };
    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThread));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedComments));
    mockReplyRepository.getRepliesByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedReplies));
    /** creating use case instance */
    const showThreadUseCase = new ShowThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });
    // Action
    const showThread = await showThreadUseCase.execute(useCasePayload);
    // Assert
    expect(showThread).toStrictEqual(expectedShownThread);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCasePayload);
  })
})
