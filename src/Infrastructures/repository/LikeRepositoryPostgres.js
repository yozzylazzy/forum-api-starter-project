// Domains
const CreatedLike = require('../../Domains/likes/entities/CreatedLike');
// Infrastructure
const LikeRepository = require('../../Domains/likes/LikeRepository');
// Error
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async createLike(newLike) {
    const { owner, commentId } = newLike;
    const id = `like-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO likes VALUES($1,$2,$3) RETURNING *',
      values: [id, owner, commentId],
    };
    const result = await this._pool.query(query);
    const resultMapped = result.rows.map((row) => ({
      id: row.id,
      owner: row.owner,
      commentId: row.comment_id,
    }));
    return new CreatedLike(resultMapped[0]);
  }

  async verifyIsLiked(commentId, userId) {
    const query = {
      text: 'SELECT * FROM likes WHERE owner = $1 AND comment_id = $2',
      values: [userId, commentId],
    };
    const result = await this._pool.query(query);
    if (result.rowCount) {
      return true;
    }
    return false;
  }

  async cancelLike(commentId, userId) {
    const query = {
      text: 'DELETE FROM likes WHERE owner = $1 AND comment_id = $2',
      values: [userId, commentId],
    };
    await this._pool.query(query);
  }

  async getLikesCountByCommentId(commentId) {
    const query = {
      text: 'SELECT COUNT(*) FROM likes WHERE comment_id = $1',
      values: [commentId],
    };
    const result = await this._pool.query(query);
    return Number(result.rows[0].count);
  }
}

module.exports = LikeRepositoryPostgres;
