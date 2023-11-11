const LikeRepository = require('../LikeRepository');

describe('', () => {
  it('should throw error when invoke abstract behaviour', async () => {
    // Arrange
    const likeRepository = new LikeRepository();
    // Action & Assert
    await expect(likeRepository.createLike({})).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likeRepository.verifyIsLiked('')).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likeRepository.cancelLike('')).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likeRepository.getLikesCountByCommentId('')).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
