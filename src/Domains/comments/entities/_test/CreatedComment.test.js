const CreatedComment = require('../CreatedComment');

describe('CreatedComment entities', () => {
  it('should trow error when payload doesnt contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'Thread Comment',
    }
    // Action & Assert
    expect(() => new CreatedComment(payload)).toThrowError('CREATED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: true,
      content: 1234,
      owner: { id: 'user-123' },
    }
    // Action & Assert
    expect(() => new CreatedComment(payload)).toThrowError('CREATED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should create CreatedComment entities correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'Thread Comment',
      owner: 'user-123',
    };
    // Action
    const { id, content, owner } = new CreatedComment(payload);
    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  })
});
