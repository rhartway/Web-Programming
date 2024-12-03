import env from 'dotenv'
import bcrypt from 'bcrypt'
import mssql from "mssql"




// committee user relationship - n:m

env.config();

/*const connection = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();*/

/*GET USER
    - First: Search for username
    - If username does not exist, return error message "No such user"
    - If user does exist, compare passwords
    - Passwords do not match, return error message "incorrect password"
    - Else, authenticate
*/


const config = {
    server: process.env.AZURE_SQL_SERVER, // better stored in an app setting such as process.env.DB_SERVER
    database: process.env.AZURE_SQL_DATABASE, // better stored in an app setting such as process.env.DB_NAME
    authentication: {
        type: 'default'
    },
    user: process.env.AZURE_SQL_USER, 
    password: process.env.AZURE_SQL_PASSWORD, 
    options: {
        encrypt: true
    }
}

async function connectAndQuery() {
    try {
        var poolConnection = await mssql.connect(config);

        console.log("Reading rows from the Table...");
        var resultSet = await poolConnection.request().query(`SELECT * from user_info`);


        // close connection only when we're certain application is finished
        poolConnection.close();
    } catch (err) {
        console.error(err.message);
    }
}

export async function getUser(username, enteredPassword) {
    var poolConnection = await mssql.connect(config);  
    try {
        // check if username in table
        var getUserRow = await poolConnection.request().query(`SELECT * FROM user_info WHERE username='${username}'`);
        if (getUserRow.recordset.length === 0) {
            // error code: no user found
            console.log("No user");
        }
        else {
            // retrieve user password
            var userPassword = await getUserRow.recordset[0].password;

            // compare password with enteredPassword
            bcrypt.compare(enteredPassword, userPassword, (err, result) => {
                if (err) {
                    console.log("Error comparing passwords:",err)
                }
                if (result) {
                    console.log("password correct");
                    return true;
                }
                else {
                    console.log("password incorrect");
                    return false;
                }
            });
            console.log("found user");
        }
    }
    catch (err) {
        console.log("Could not connect to database");
    }
    /**
     * var poolConnection = await mssql.connect(config).then();
     */
}

/**
 * JWT - ensures access to data, 
 */


// Turn into prepared statements
export async function makeUser(fname, lname, username, password,email) {
    try {
        var poolConnection = await mssql.connect(config);

        // generate bcrypt salts
        const saltNum = 10;

        bcrypt.genSalt(saltNum, (err, salts) => {
            if (err) {
                console.log("Failed to generate salts");
                return;
            }
            // hash password 
            console.log("successfully generated salts");
            bcrypt.hash(password, salts, (err, hash) => {
                if (err) {
                    console.log("Failed to hash password");
                    return;
                }
                console.log("successfully hashed password");
                // store in database
                var create = poolConnection.request().query(`INSERT INTO user_info 
                    (username, password, firstName, lastName,email) VALUES ('${username}','${hash}','${fname}','${lname}','${email}')`);

            })
        });
        
    }
    catch (err) {
        console.log("registration error - could not connect")
    }
}

export async function authenticateUser(username, password) {

}

/*console.log(await getUser("orange", "pineapple"));
console.log(await getUser("run", "dev"));
console.log(await getUser("gen5", "bestgen"));*/

console.log("...Starting");
//connectAndQuery();


