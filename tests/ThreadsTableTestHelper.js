/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
  async addThreads({
    id = 'thread-123', title = 'Dicoding Thread Title', body = 'dicoding thread body', owner = 'user-123', date = 'thread date'
  }) {
    const query = {
      text: 'INSERT INTO threads VALUES($1,$2,$3,$4,$5)',
      values: [id, title, body, owner, date],
    }
    await pool.query(query);
  },
  async findThreadsById(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id =$1',
      values: [id],
    };
    const result = await pool.query(query);
    return result.rows;
  },
  async cleanTable() {
    await pool.query('TRUNCATE TABLE threads');
  },
}

module.exports = ThreadsTableTestHelper;
