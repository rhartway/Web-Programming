import express from 'express'
import cors from 'cors'
import { getUser, makeUser } from './database.js';
import bodyParser from 'body-parser';
import token from 'jsonwebtoken'



const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const port = 8080;

// Login + Registration

/**
 * Registration
 * Get password and username from frontend
 * encrypt password with bcrypt
 * store in database
 */

app.use(cors({origin: "http://127.0.0.1:5500"}));


/**
 * When creating new user:
 * hash password
 * create new user object (javascript object)
 * upload pfp to server
 * add to database in order: username, password, user object
 */
app.post("/register", (req, res) => {
    const {fname, lname, username, password,email} = req.body;
    makeUser(fname,lname,username,password,email);
    res.status(200).send({
        message: "Registration successful",
        redirect: "http://127.0.0.1:5500/client/index.html"
    });
});



// User authentication
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    //const result = await getUser(username, password);

    if (!getUser(username, password)) {
        res.status(401).send("User not found or password incorrect");
    }
    else {
        // redirect to home page
        res.status(200).send({
            message: "Successful login",
            redirect: "http://127.0.0.1:5500/client/index.html"
        });
    }
    

});

// Update Profile
app.put("/profile/update", (req, res) => {

});

// Delete user

// Create committee

// Join committee

// Create motion

// Delete motion

//

// Create + Join + Delete Meeting Room

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});

