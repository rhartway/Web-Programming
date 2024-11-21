import express from 'express'
import cors from 'cors'
import { getUser, makeUser } from './database.js';
import bodyParser from 'body-parser';



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
    const {username, password} = req.body;
    res.status(200).send("OK");
    makeUser(username,password);


});

/**
 * When retrieving users
 * Check if user exists
 */
app.get("/login", (req, res) => {
    const { user, password } = req.body;

    if (!(getUser(username, password))) {
        res.status(401).send("User not found or password incorrect");
    }
    else {
        res.status(200).send("Welcome!");
    }
});

// Update Profile
app.put("/profile/update", (req, res) => {

});

// Create + Join + Delete Meeting Room

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});

