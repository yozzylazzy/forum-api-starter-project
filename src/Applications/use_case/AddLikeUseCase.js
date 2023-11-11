const CreateLike = require('../../Domains/likes/entities/CreateLike');

class AddLikeUseCase {
  constructor({ commentRepository, likeRepository }) {
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    await this._commentRepository.verifyCommentExist(useCasePayload.commentId);
    const newLike = new CreateLike(useCasePayload);
    return this._likeRepository.createLike(newLike);
  }
}

module.exports = AddLikeUseCase;
