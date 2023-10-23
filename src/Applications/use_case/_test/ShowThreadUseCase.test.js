const ShowThreadUseCase = require('../ShowThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('showThreadUseCase', () => {
  it('should orchestrating the show thread action correctly', async () => {
    const expectedThread = {
      id: 'thread-123',
      title: 'Dicoding Thread',
      body: 'Dicoding is good',
      username: 'user-123',
      date: '2023-10-23T01:30:51Z',
    };

  })
})
