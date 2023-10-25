// Domains
const CreatedReply = require('../../Domains/replies/entities/CreatedReply');
// Infrastructure
const ReplyRepository = require('../../Domains/replies/ReplyRepository');
// Error
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async createReply(newReply) {
    const { content, owner, commentId } = newReply;
    const id = `reply-${this._idGenerator()}`;
    const date = new Date().toISOString();
    const query = {
      text: `INSERT INTO replies(id,content,owner,comment_id,date)
      VALUES($1,$2,$3,$4,$5) RETURNING id, content, owner`,
      values: [id, content, owner, commentId, date],
    };
    const result = await this._pool.query(query);
    return new CreatedReply(result.rows[0]);
  }

  async verifyReplyExist(replyId) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [replyId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('reply tidak ditemukan');
    }
  }

  async verifyReplyOwner(replyId, owner) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1 AND owner = $2',
      values: [replyId, owner],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new AuthorizationError('gagal memverifikasi reply dan penulis reply');
    }
  }

  async deleteReplyById(replyId) {
    const query = {
      text: 'UPDATE replies SET is_delete = true WHERE id = $1',
      values: [replyId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('reply tidak ditemukan');
    }
  }

  async getRepliesByThreadId(threadId) {
    const query = {
      text: `
      SELECT r.id, r.content, r.date, u.username, r.is_delete, r.comment_id
      FROM replies r
      INNER JOIN users u ON r.owner = u.id
      INNER JOIN comments c ON r.comment_id = c.id
      WHERE c.thread_id = $1
      ORDER BY r.date ASC
    `,
      values: [threadId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = ReplyRepositoryPostgres;
