
var mysql = require('mysql')

function query(sql){
    return new Promise(function(resolve, reject){
        let connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        })
        connection.connect()
        connection.query(sql, function (err, rows, fields) {
            console.log({err, rows, fields});
            if (err){
                reject(err)
            } else {
                resolve({rows, fields})
            }
            connection.end()
        })

    });
}
module.exports = query
//
// connection.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
//     if (err) throw err
//
//     console.log('The solution is: ', rows[0].solution)
// })
//
// connection.end()