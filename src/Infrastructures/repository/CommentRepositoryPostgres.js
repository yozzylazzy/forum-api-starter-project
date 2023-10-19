const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require("../../Domains/comments/CommentRepository");
const CreatedComment = require("../../Domains/comments/entities/CreatedComment");

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async createComment(newComment) {
    const { content, owner, threadId } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();
    const query = {
      text: 'INSERT INTO comments VALUES($1,$2,$3,$4,false,$5) RETURNING id, content, owner',
      values: [id, content, owner, threadId, date],
    }
    const result = await this._pool.query(query);
    return new CreatedComment(result.rows[0]);
  }

  async verifyCommentIsExist(commentId) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [commentId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }
  }

  async getCommentById(commentId) {
    const query = {
      text: `SELECT *
      FROM comments 
      INNER JOIN users ON comments.owner = users.id
      WHERE comments.id = $1
      `,
      values: [commentId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }
    return result.rows[0];
  }
}

module.exports = CommentRepositoryPostgres;
