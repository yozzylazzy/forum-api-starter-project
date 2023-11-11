class ShowThreadUseCase {
  constructor({
    threadRepository, commentRepository, replyRepository, likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    const thread = await this._threadRepository.getThreadById(useCasePayload);
    const comments = await this._commentRepository.getCommentsByThreadId(useCasePayload);
    const replies = await this._replyRepository.getRepliesByThreadId(useCasePayload);

    const cleanedComments = comments.map((comment) => {
      if (comment.is_delete) {
        comment.content = '**komentar telah dihapus**';
      }
      delete comment.is_delete;
      return comment;
    });

    const cleanedReplies = replies.map((reply) => {
      if (reply.is_delete) {
        reply.content = '**balasan telah dihapus**';
      }
      delete reply.is_delete;
      return reply;
    });

    const commentsWithReplies = this._addReplyToComment(cleanedComments, cleanedReplies);
    for (const comment of commentsWithReplies) {
      comment.likeCount = await this._likeRepository.getLikesCountByCommentId(comment.id);
    } return {
      ...thread,
      comments: commentsWithReplies,
    };
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
