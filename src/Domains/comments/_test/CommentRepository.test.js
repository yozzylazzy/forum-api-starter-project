const CommentRepository = require('../CommentRepository');

describe('CommentRepository interface', () => {
  it('should throw error when invoke abstract behaviour', async () => {
    // Arrange
    const commentRepository = new CommentRepository();
    // Action & Assert
    await expect(commentRepository.createComment({})).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentRepository.verifyCommentExist('')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentRepository.getCommentById('')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  })
});
