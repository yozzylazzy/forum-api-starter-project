const CreateThread = require('../CreateThread');

describe('a CreateTread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'Dicoding Thread',
    };
    // Action & Assert
    expect(() => new CreateThread(payload)).toThrowError('CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when payload didnt meet data type specification', () => {
    // Arrange
    const payload = {
      title: 123,
      body: true,
      owner: { abc: 123 },
    };
    // Action & Assert
    expect(() => new CreateThread(payload)).toThrowError('CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should create CreateThread entities correctly', () => {
    // Arrange
    const payload = {
      title: 'Dicoding Thread',
      body: 'Dicoding is ...',
      owner: 'user-123',
    };
    // Action
    const { title, body, owner } = new CreateThread(payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(owner).toEqual(payload.owner);
  });
});
