const CreateLike = require('../CreateLike');

describe('CreateLike entities', () => {
  it('should throw error when payload doesnt contain needed property', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
    };
    // Action & Assert
    expect(() => new CreateLike(payload)).toThrowError('CREATE_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      owner: true,
      commentId: { id: 1 },
    };
    // Action & Assert
    expect(() => new CreateLike(payload)).toThrowError('CREATE_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should create CreateLike correctly', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
      commentId: 'comment-123',
    };
    // Action
    const { owner, commentId } = new CreateLike(payload);
    // Assert
    expect(owner).toEqual(payload.owner);
    expect(commentId).toEqual(payload.commentId);
  });
});
