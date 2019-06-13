import qs from 'qs'
import DB from '../../db.js'

const mysql = require('mysql')
const connection = mysql.createConnection({
    host: DB.host,
    user: DB.user,
    password: DB.password,
    database: 'wap'
})
console.log(connection)
console.log(qs)
