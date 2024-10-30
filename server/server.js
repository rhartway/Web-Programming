import express from 'express'
import cors from 'cors'
import { getUser, makeUser } from './database.js';

const app = express();
const port = 8080;

// Login + Registration

/**
 * Registration
 * Get password and username from frontend
 * encrypt password with bcrypt
 * store in database
 */
app.post("/register", (req, res) => {
    const { key } = req.body; // get the request
    console.log(key);
    

});

app.get("/login", (req, res) => {
    res.body
});

// Update Profile
app.put("/profile/update", (req, res) => {

});

// Create + Join + Delete Meeting Room

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});