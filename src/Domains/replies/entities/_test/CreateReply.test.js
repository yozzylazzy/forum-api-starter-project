const CreatedReply = require('../CreatedReply');

describe('createdReply entities', () => {
  it('should throw error when payload doesnt contain needed property', () => {
    // Arrange
    const payload = {
      content: 'Comment Reply',
    };
    // Action & Assert
    expect(() => new CreatedReply(payload)).toThrowError('CREATED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: {},
      owner: true,
    };
    // Action & Assert
    expect(() => new CreatedReply(payload)).toThrowError('CREATED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should create CreatedReply entities correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'Comment Reply',
      owner: 'user-123',
    };
    // Action
    const createdReply = new CreatedReply(payload);
    // Assert
    expect(createdReply).toBeInstanceOf(CreatedReply);
    expect(createdReply.id).toEqual(payload.id);
    expect(createdReply.content).toEqual(payload.content);
    expect(createdReply.owner).toEqual(payload.owner);
  });
});
