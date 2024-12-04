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
            console.log(getUserRow.recordset);
            console.log("No user");
        }
        else {
            console.log("else triggered");
            // retrieve user password
            var userPassword = await getUserRow.recordset[0].password;

            const res = await bcrypt.compare(enteredPassword, userPassword);
            console.log("found user");
            if (res) {
                return getUserRow.recordset[0];
            }
            else {
                return false;
            }
            
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
export async function makeUser(username, password, fname, lname, email, date) {
    try {
        var poolConnection = await mssql.connect(config);

        // check if username exists

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
                    (username, password, firstName, lastName,email,date_created) VALUES ('${username}','${hash}','${fname}','${lname}','${email}','${date}')`);

            })
        });

    }
    catch (err) {
        console.log("registration error - could not connect")
    }
}

export async function deleteUser() {

}

export async function updateUser() {

}

export async function createCommittee(cname, cpassword, date, creatorID, chairmanID) {
    try {
        var poolConnection = await mssql.connect(config);

        // add committee 
        var addCommittee = await poolConnection.request().query(`INSERT INTO committee_info (committeeName, committeePassword,chairmanID, creatorID, date_created) OUTPUT inserted.committeeID VALUES ('${cname}', '${cpassword}', '${chairmanID}', '${creatorID}', '${date})`);

        // get committee id
        const committeeID = addCommittee.recordset[0].committeeID;

        // add creatorID and committeeID to junction table
        var addJunction = await poolConnection.request().query(`INSERT INTO user_committee_junction (userID, committeeID) VALUES ('${creatorID}','${committeeID}')`)

        return true;
    }
    catch (err) {
        console.log("Could not create committee")

        return false;
    }
}

export async function getCommittees(currentUserKey) {
    try {
        var poolConnection = await mssql.connect(config);

        var resultSet = await poolConnection.request().query(`SELECT * FROM user_committee_junction WHERE userID='${currentUserKey}'`);

        if (resultSet.recordset.length === 0) {
            return false;
        }
        else {
            return resultSet.recordset[0];
        }
    }
    catch (err) {
        console.log("Could not connect to database", err)
    }
}

export async function findCommittee(cname) {
    
}

export async function joinCommittee(cpassword) {
    
}

export async function deleteCommittee() {

}

/*console.log(await getUser("orange", "pineapple"));
console.log(await getUser("run", "dev"));
console.log(await getUser("gen5", "bestgen"));*/


// Motions stuff

export async function makeMotion(title, desc, creator) {
    try {
        var poolConnection = await mssql.connect(config);

        var create = poolConnection.request().query(`INSERT INTO motions 
            (title, description, creator, date) VALUES ('${title}','${desc}','${creator}', GETDATE())`); //do i need '' around GETDATE()?
    }
    catch (err) {
        console.log("Error creating motion:", err);
    }
}

// retrieve all motions
export async function getMotions() {
    try {
        var poolConnection = await mssql.connect(config);
        const result = await poolConnection.request().query(`
            SELECT motionKey, title, description, creator, date
            FROM motions
            ORDER BY date DESC
        `);
        return result.recordset;
    } catch (err) {
        console.log("Error retrieving motion:", err);
        return [];
    }
}


// retrive a specific motion (idk when id use this but whatevr)
export async function getMotion(motionID) {
    try {
        var poolConnection = await mssql.connect(config);
        const result = await poolConnection.request().query(`
            SELECT title, description, creator, date
            FROM motions
            WHERE motionID = '${motionID}'
        `);
        return result.recordset;
    } catch (err) {
        console.log("Error retrieving motion:", err);
        return [];
    }
}


// User + Message Stuff
export async function saveChatMessage(motionID, sender, message) {
    try {
        var poolConnection = await mssql.connect(config);
        await poolConnection.request().query(`
            INSERT INTO motion_messages (motionID, sender, message)
            VALUES ('${motionID}', '${sender}', '${message}')
        `);
    } catch (err) {
        console.log("Error saving chat message:", err);
    }
}

export async function getChatMessages(motionID) {
    try {
        var poolConnection = await mssql.connect(config);
        const result = await poolConnection.request().query(`
            SELECT sender, message, timestamp
            FROM motion_messages
            WHERE motionID = '${motionID}'
            ORDER BY timestamp ASC
        `);
        return result.recordset;
    } catch (err) {
        console.log("Error retrieving chat messages:", err);
        return [];
    }
}


console.log("...Starting");
//connectAndQuery();


