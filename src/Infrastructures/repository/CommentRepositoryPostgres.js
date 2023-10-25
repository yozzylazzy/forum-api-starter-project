// Domains
const CreatedComment = require('../../Domains/comments/entities/CreatedComment');
// Infrastructure
const CommentRepository = require('../../Domains/comments/CommentRepository');
// Error
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

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
    };
    const result = await this._pool.query(query);
    return new CreatedComment(result.rows[0]);
  }

  async verifyCommentExist(commentId) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [commentId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }
  }

  async verifyCommentOwner(commentId, owner) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND owner = $2',
      values: [commentId, owner],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new AuthorizationError('gagal memverifikasi comment dan penulis komentar');
    }
  }

  async deleteCommentById(commentId) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1',
      values: [commentId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT c.*, u.username
      FROM comments c
      INNER JOIN users u ON c.owner = u.id
      WHERE c.thread_id = $1
      ORDER BY c.date ASC
      `,
      values: [threadId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = CommentRepositoryPostgres;
