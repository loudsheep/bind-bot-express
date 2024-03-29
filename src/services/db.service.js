const dbConfig = require('../config/db.config');
const mysql = require('mysql2/promise');

async function query(sql, values) {
    let conn = await mysql.createConnection(dbConfig);

    const [rows,] = await conn.execute(sql, values);

    return rows;
}

module.exports = {
    query
}