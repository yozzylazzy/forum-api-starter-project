class CreateLike {
  constructor(payload) {
    this._verifyPayload(payload);
    const { id, owner, commentId } = payload;
    this.id = id;
    this.owner = owner;
    this.commentId = commentId;
  }

  _verifyPayload({ id, owner, commentId }) {
    if (!id || !owner || !commentId) {
      throw new Error('CREATED_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof id !== 'string' || typeof owner !== 'string' || typeof commentId !== 'string') {
      throw new Error('CREATED_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CreateLike;
