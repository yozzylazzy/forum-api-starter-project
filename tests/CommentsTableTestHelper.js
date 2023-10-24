/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123', content = 'Thread Comment', owner = 'user-123', threadId = 'thread-123',
    isDelete = false, date = 'comment date'
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1,$2,$3,$4,$5,$6)',
      values: [id, content, owner, threadId, isDelete, date],
    }
    await pool.query(query);
  },
  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND is_delete = false',
      values: [id],
    }
    const result = await pool.query(query);
    return result.rows;
  },
  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  }
}

module.exports = CommentsTableTestHelper;
