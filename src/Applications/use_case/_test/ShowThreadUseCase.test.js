const ShowThreadUseCase = require('../ShowThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');

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
        date: '2023-10-24T22:54:05Z',
        content: 'Thread Comment',
        is_delete: false,
      },
      {
        id: 'comment-456',
        username: 'user-123',
        date: '2023-10-24T22:54:05Z',
        content: 'Thread Comment',
        is_delete: true,
      },
    ];
    const expectedReplies = [
      {
        id: 'reply-123',
        content: 'reply Content',
        date: '2023-10-24T22:54:05Z',
        username: 'user-123',
        is_delete: false,
        comment_id: 'comment-123',
      },
      {
        id: 'reply-456',
        content: 'reply Content 2',
        date: '2023-10-24T22:54:05Z',
        username: 'user-123',
        is_delete: true,
        comment_id: 'comment-123',
      },
    ];
    const expectedLikes = [
      {
        id: 'like-123',
        owner: 'user-123',
        commentId: 'comment-123',
      },
      {
        id: 'like-456',
        owner: 'user-123',
        commentId: 'comment-456',
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
          date: '2023-10-24T22:54:05Z',
          replies: [
            {
              id: 'reply-123',
              content: 'reply Content',
              date: '2023-10-24T22:54:05Z',
              username: 'user-123',
            },
            {
              id: 'reply-456',
              content: '**balasan telah dihapus**',
              date: '2023-10-24T22:54:05Z',
              username: 'user-123',
            },
          ],
          content: 'Thread Comment',
          likeCount: 1,
        },
        {
          id: 'comment-456',
          username: 'user-123',
          date: '2023-10-24T22:54:05Z',
          replies: [],
          content: '**komentar telah dihapus**',
          likeCount: 1,
        },
      ],
    };
    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();
    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(expectedThread));
    mockCommentRepository.getCommentsByThreadId = jest.fn(() => Promise.resolve(expectedComments));
    mockReplyRepository.getRepliesByThreadId = jest.fn(() => Promise.resolve(expectedReplies));
    mockLikeRepository.getLikesCountByCommentId = jest.fn(() => Promise.resolve(1));
    /** creating use case instance */
    const showThreadUseCase = new ShowThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });
    // Action
    const showThread = await showThreadUseCase.execute(useCasePayload);
    // Assert
    expect(showThread).toStrictEqual(expectedShownThread);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCasePayload);
    expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(useCasePayload);
    expect(mockLikeRepository.getLikesCountByCommentId).toBeCalledWith('comment-123');
    expect(mockLikeRepository.getLikesCountByCommentId).toBeCalledWith('comment-456');
  });
});
