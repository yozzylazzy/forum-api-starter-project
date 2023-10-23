const CreateReply = require("../../Domains/replies/entities/CreateReply");

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }
  async execute(useCasePayload) {
    await this._threadRepository.verifyThreadExist(useCasePayload.threadId);
    await this._commentRepository.verifyCommentExist(useCasePayload.commentId);
    const createReply = new CreateReply(useCasePayload);
    return this._replyRepository.createReply(createReply);
  }
}

module.exports = AddReplyUseCase;
