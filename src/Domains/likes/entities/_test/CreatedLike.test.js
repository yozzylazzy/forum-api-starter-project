const CreatedLike = require('../CreatedLike');

describe('CreatedLike entities', () => {
  it('should throw error when payload doesnt contain needed property', () => {
    // Arrange
    const payload = {
      id: 'like-123',
      owner: 'user-123',
    };
    // Action & Assert
    expect(() => new CreatedLike(payload)).toThrowError('CREATED_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: true,
      owner: 'user-123',
      commentId: { id: 1 },
    };
    // Action & Assert
    expect(() => new CreatedLike(payload)).toThrowError('CREATED_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should create CreatedLike entities correctly', () => {
    // Arrange
    const payload = {
      id: 'like-123',
      owner: 'user-123',
      commentId: 'comment-123',
    };
    // Action
    const { id, owner, commentId } = new CreatedLike(payload);
    // Assert
    expect(id).toEqual(payload.id);
    expect(owner).toEqual(payload.owner);
    expect(commentId).toEqual(payload.commentId);
  });
});
