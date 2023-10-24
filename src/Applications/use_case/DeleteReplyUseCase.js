class DeleteReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);
    const {
      threadId, commentId, replyId, owner,
    } = useCasePayload;
    await this._threadRepository.verifyThreadExist(threadId);
    await this._commentRepository.verifyCommentExist(commentId);
    await this._replyRepository.verifyReplyExist(replyId);
    await this._replyRepository.verifyReplyOwner(replyId, owner);
    await this._replyRepository.deleteReplyById(replyId);
  }

  _validatePayload(useCasePayload) {
    const {
      threadId, commentId, replyId, owner,
    } = useCasePayload;
    if (!threadId || !commentId || !replyId || !owner) {
      throw new Error('DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PAYLOAD');
    }
    if (typeof threadId !== 'string' || typeof commentId !== 'string' || typeof replyId !== 'string' || typeof owner !== 'string') {
      throw new Error('DELETE_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteReplyUseCase;
