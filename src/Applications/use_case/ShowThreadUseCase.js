class ShowThreadUseCase {
  constructor({
    threadRepository, commentRepository, replyRepository
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }
  async execute(useCasePayload) {
    const thread = await this._threadRepository.getThreadById(useCasePayload);
    const comments = await this._commentRepository.getCommentsByThreadId(useCasePayload);
    const replies = await this._replyRepository.getRepliesByThreadId(useCasePayload);
    const validatedComments = this._validateDeletedComment(comments);
    const validatedReplies = this._validateDeletedReply(replies);
    const commentsWithReplies = this._addReplyToComment(validatedComments, validatedReplies);
    return {
      ...thread,
      comments: commentsWithReplies,
    };
  }
  _validateDeletedComment(comments) {
    for (const comment of comments) {
      if (comment.is_delete) {
        comment.content = '**komentar telah dihapus**';
      }
      delete comment.is_delete;
    }
    return comments;
  }
  _validateDeletedReply(replies) {
    for (const reply of replies) {
      if (reply.is_delete) {
        reply.content = '**balasan telah dihapus**';
      }
      delete reply.is_delete;
    }
    return replies;
  }
  _addReplyToComment(comments, replies) {
    for (const comment of comments) {
      comment.replies = [];
      for (const reply of replies) {
        if (reply.comment_id === comment.id) {
          comment.replies.push(reply);
        }
        delete reply.comment_id;
      }
    }
    return comments;
  }
}

module.exports = ShowThreadUseCase;
