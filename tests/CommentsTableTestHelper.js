/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123', content = 'Comment Section', owner = 'user-123', threadId = 'thread-123',
    isDelete = false, date = 'comment date'
  }) {
    const query = {
      text: 'INSER INTO comments VALUES($1,$2,$3,$4,$5,$6)',
      values: [id, content, owner, threadId, isDelete, date],
    }
    await pool.query(query);
  },
  async findCommentById(id) {
    const query = {
      text: 'SELECTG * FROM comments WHERE id = $1',
      values: [id],
    }
    const result = await pool.query(query);
    return result.rows;
  },
  async cleanTable() {
    await pool.query('TRUNCATE TABLE comments');
  }
}

module.exports = CommentsTableTestHelper;
