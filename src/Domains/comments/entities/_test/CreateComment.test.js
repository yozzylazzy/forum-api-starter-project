const CreateComment = require('../CreateComment');

describe('CreateComment entities', () => {
  it('should trow error when payload doesnt contain needed property', () => {
    // Arrange
    const payload = {
      content: 'Thread Comment',
    }
    // Action & Assert
    expect(() => new CreateComment(payload)).toThrowError('CREATE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      content: true,
      owner: 1234,
      threadId: { id: 'thread-123' },
    }
    // Action & Assert
    expect(() => new CreateComment(payload)).toThrowError('CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should create CreateComment entities correctly', () => {
    // Arrange
    const payload = {
      content: 'Thread Comment',
      owner: 'user-123',
      threadId: 'thread-123',
    };
    // Action
    const { content, owner, threadId } = new CreateComment(payload);
    // Assert
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
    expect(threadId).toEqual(payload.threadId);
  })
});
