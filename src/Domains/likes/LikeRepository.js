class LikeRepository {
  async createLike(newLike) {
    throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyIsLiked(commentId, userId) {
    throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async cancelLike(commentId, userId) {
    throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getLikesCountByCommentId(commentId) {
    throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = LikeRepository;
