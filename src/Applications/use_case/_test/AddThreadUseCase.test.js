const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orhectrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'Dicoding Thread',
      body: 'Dicoding is good',
      owner: 'user-123',
    };
    const mockCreatedThread = new CreatedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: useCasePayload.owner,
    });
    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    /** mocking needed function */
    mockThreadRepository.createThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockCreatedThread));
    /** creating use case instance */
    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });
    // Action
    const createdThread = await getThreadUseCase.execute(useCasePayload);
    // Assert
    expect(createdThread).toStrictEqual(new CreatedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: useCasePayload.owner,
    }));
    expect(mockThreadRepository.createThread).toBeCalledWith(new CreateThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: useCasePayload.owner,
    }));
  });
});
