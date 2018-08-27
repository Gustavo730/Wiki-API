const { Pool } = require('pg')

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'wiki',
  password: 'admin'
})

module.exports = {
 query: (text, params, callback) => {
   return pool.query(text, params, callback)
 }
}
