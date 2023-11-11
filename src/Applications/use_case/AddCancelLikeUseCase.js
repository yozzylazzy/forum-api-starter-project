const CreateLike = require('../../Domains/likes/entities/CreateLike');

class AddLikeUseCase {
  constructor({ commentRepository, likeRepository, threadRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.verifyThreadExist(useCasePayload.threadId);
    await this._commentRepository.verifyCommentExist(useCasePayload.commentId);
    const isLiked = await this._likeRepository
      .verifyIsLiked(useCasePayload.commentId, useCasePayload.owner);
    if (isLiked) {
      await this._likeRepository.cancelLike(useCasePayload.commentId, useCasePayload.owner);
    } else {
      const newLike = new CreateLike(useCasePayload);
      return this._likeRepository.createLike(newLike);
    }
    return null;
  }
}

module.exports = AddLikeUseCase;
