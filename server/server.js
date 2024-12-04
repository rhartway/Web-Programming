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
app.post("/register", async (req, res) => {
    const {username, password,fname, lname, email} = req.body;

    console.log(fname, lname);
    let currentDate = new Date();

    let date = ("0" + currentDate.getDate()).slice(-2);

    // get current month
    let month = ("0" + (currentDate.getMonth() + 1)).slice(-2);

    // get current year
    let year = currentDate.getFullYear();

    let fullDate = year + "-" + month + "-" + date;

    makeUser(username,password,fname,lname,email,fullDate);

    const userInfo = {
        username: username,
        password: password,
        firstName: fname,
        lastName: lname,
        email: email
    }

    res.status(200).send({
        userData: userInfo
    });

});

// Server should store current user 
let currentUser;

// User authentication
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);
    console.log("login api");
    const result = await getUser(username, password);
    // const result = getUser(username, password);

    if (!result) {
        res.status(401).send("User not found or password incorrect");
    }
    else {
        const userInfo = { // store user data in session storage on client side
            key: result.userKey,
            username: result.username,
            password: result.password,
            fname: result.firstName,
            lname: result.lastName,
            email: result.email
        }

        currentUser = userInfo;
        // redirect to home page
        res.status(200).send({
            userData: userInfo
        });
    }
    

});

 

// Update user
app.put("/profile/update", (req, res) => {

});

// Delete user

// Access committee
app.get("/committee/:name", (req, res) => {
    const committeeID = req.params.name;


});

// Create committee
app.post("/committee/create", (req, res) => {
    const {cname, cpassword} = req.body;
});

// Delete committee

// Join committee

// Update committee

// Get motion

// Create motion

// Delete motion

// 


app.listen(port, () => {
    console.log(`App running on port ${port}`);
});

