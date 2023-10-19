const CreatedThread = require('../CreatedThread');

describe('a CreatedThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'Dicoding Thread',
    };
    // Action & Assert
    expect(() => new CreatedThread(payload)).toThrowError('CREATED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when payload didnt meet data type specification', () => {
    // Arrange
    const payload = {
      id: true,
      title: 'Dicoding Thread',
      body: 1234,
      owner: { abc: 1 },
    };
    // Action & Assert
    expect(() => new CreatedThread(payload)).toThrowError('CREATED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should create CreatedThread entities correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'Dicoding Thread',
      body: 'Dicoding is ...',
      owner: 'user-123',
    };
    // Action
    const {
      id, title, body, owner,
    } = new CreatedThread(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(owner).toEqual(payload.owner);
  });
});
