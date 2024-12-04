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
    socket.on('joinRoom', async (motionKey) => {
        socket.join(motionKey);
        const messages = await getChatMessages(motionKey);
        socket.emit('messageHistory', messages);
    });

    socket.on('chatMessage', async ({ motionKey, sender, message }) => {
        await saveChatMessage(motionKey, sender, message);
        io.to(motionKey).emit('message', { sender, message });
    });

    handleChatConnection(socket);
});

// Serve static files from the client directory
app.use(express.static('client'));

// Serve the homepage
app.get('/', function (req, res) {
    res.render('index', {});
  });
  


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

    // add userkey here
    /*const userInfo = {
        username: username,
        password: password,
        firstName: fname,
        lastName: lname,
        email: email
    }*/

    res.status(200).send("Registration Success");

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
app.get('/chatroom/:motionKey', (req, res) => {
  const motionKey = req.params.motionKey;
  res.sendFile(__dirname + '/client/chatroom.html');
});

io.on("connection", (socket) => {
    socket.on('joinRoom', async (motionKey) => {
      socket.join(motionKey);
      const messages = await getChatMessages(motionKey);
      socket.emit('messageHistory', messages);
    });
  
    socket.on('chatMessage', async ({ motionKey, sender, message }) => {
        await saveChatMessage(motionKey, sender, message);
        io.to(motionKey).emit('message', { sender, message });
    });

  
    handleChatConnection(socket);
  });





app.listen(port, () => {
    console.log(`App running on port ${port}`);
});

