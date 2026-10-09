const pool = require('./db/connection')

const testConnection = async () => {
    const result = await pool.query('SELECT NOW()')
    console.log(result.rows)
    await pool.end()
}

testConnection()