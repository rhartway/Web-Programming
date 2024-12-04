import express from 'express'
import cors from 'cors'
import { getUser, makeUser } from './database.js';
import { saveChatMessage, getChatMessages } from './database.js';
import { getMotion, getMotions, makeMotion } from './database.js';

import bodyParser from 'body-parser';
import token from 'jsonwebtoken'
import { Server } from "socket.io";

import { createServer } from "node:http";

  
import {
    handleChatConnection,
    setIoInstance,
} from "../controllers/chatController.js"; 

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//add server and io for socket
const server = createServer(app);
const io = new Server(server)

const port = 8080;

// Login + Registration

/**
 * Registration
 * Get password and username from frontend
 * encrypt password with bcrypt
 * store in database
 */

app.use(cors({origin: "http://127.0.0.1:5500"}));

//set io instance
setIoInstance(io);
// Chat connection handling
io.on("connection", (socket) => {
    socket.on('joinRoom', async (motionID) => {
        socket.join(motionID);
        const messages = await getChatMessages(motionID);
        socket.emit('messageHistory', messages);
    });

    socket.on('chatMessage', async ({ motionID, sender, message }) => {
        await saveChatMessage(motionID, sender, message);
        io.to(motionID).emit('message', { sender, message });
    });

    handleChatConnection(socket);
});




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

/* Motion stuff
 * like getting motions and making them
 * and stuff
 */
app.get('/api/motions', async (req, res) => {
    try {
        const motions = await getMotions();
        res.json(motions);
    } catch (err) {
        res.status(500).send("Error retrieving motions");
    }
});

//TODO: API for making a motion, retrieving specific motion

// Create + Join + Delete Meeting/Chat Room
//route to chatroom
app.get('/chatroom/:motionID', (req, res) => {
  const motionID = req.params.motionID;
  res.sendFile(__dirname + '/client/chatroom.html');
});

io.on("connection", (socket) => {
    socket.on('joinRoom', (motionID) => {
      socket.join(motionID);
    });
  
    socket.on('chatMessage', ({ motionID, message }) => {
      io.to(motionID).emit('message', message);
    });
  
    handleChatConnection(socket);
  });





app.listen(port, () => {
    console.log(`App running on port ${port}`);
});

