import mysql from 'mysql2'
import env from 'dotenv'

env.config();

const connection = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();

/*GET USER
    - First: Search for username
    - If username does not exist, return error message "No such user"
    - If user does exist, compare passwords
    - Passwords do not match, return error message "incorrect password"
    - Else, authenticate
*/
export async function getUser(username, password) {
    const response = connection.query(`SELECT * FROM users WHERE username = ?`, username);
    if (response === undefined) {
        // error message: user does not exist
    }
}

export async function makeUser(username, password, profile) {
    const create = connection.query(`INSERT INTO users (username, password) values (?,?,?)`, [username, password, profile]);
}

