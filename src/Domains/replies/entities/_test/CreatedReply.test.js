const CreateReply = require('../CreateReply');

describe('createReply entities', () => {
  it('should throw error when payload doesnt contain needed property', () => {
    // Arrange
    const payload = {
      content: 'CommentReply',
    };
    // Action & Assert
    expect(() => new CreateReply(payload)).toThrowError('CREATE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      content: {},
      owner: true,
      commentId: 1.2,
    };
    // Action & Assert
    expect(() => new CreateReply(payload)).toThrowError('CREATE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should create CreateReply entities correctly', () => {
    // Arrange
    const payload = {
      content: 'Comment Reply',
      owner: 'user-123',
      commentId: 'comment-123',
    };
    // Action
    const createReply = new CreateReply(payload);
    // Assert
    expect(createReply).toBeInstanceOf(CreateReply);
    expect(createReply.content).toEqual(payload.content);
    expect(createReply.owner).toEqual(payload.owner);
    expect(createReply.commentId).toEqual(payload.commentId);
  });
});
