

// Get the current directory name (with ESM)

// Construct the path to the JSON file
// const filePath = "../source/users.json";

// Function to read JSON data from file
// const readJsonFile = async (filePath) => {
//     try {
//         const data = await fs.readFile(filePath, 'utf8');
//         return JSON.parse(data);
//     } catch (err) {
//         throw err;
//     }
// };

// app.get('/api/get-user', (req, res) => {
//     courseCache = {};
//     cacheKeys = [];
//     res.json({message: 'Cache has been cleared'});
//   });


// const presetUsername = "admin";
// const presetPassword = "1234";

// const checkUsers = async (filePath, username, password) => {
//     try {
//         const users = await readJsonFile(filePath); 
        
        
//         for (const key in users) {
//             const user = users[key];
//             if (user.username === username && user.password === password) {
//                 return true; // Credentials are valid
//             }
//         }
//         return false; // No match found
//     } catch (error) {
//         console.error('Failed to check credentials:', error);
//         throw error; // Optionally re-throw for higher-level error handling
//     }
// };

if (window.location.pathname.includes("index.html")) {
    // Code specific to index.html
    const loginButton = document.querySelector("#login_btn");
    if (loginButton) {
        loginButton.addEventListener('click', (event) => {
            alert("Login button has been clicked");
            // console.log(presetPassword);
            // event.preventDefault();
            // const enteredUsername = document.querySelector("#username").value;
            // const enteredPassword = document.querySelector("#password").value;
            

            // if (checkUsers(filePath, enteredUsername, enteredPassword)) {
            //     alert("Accepted");
            // } else {
            //     alert("Invalid username or password");
            // }
        });
    }




} else if (window.location.pathname.includes("register.html")) {
    // Code specific to register.html
    const registerButton = document.querySelector("#sign_up_btn");
    if (registerButton) {
        registerButton.addEventListener('click', () => {
            alert("Register button has been clicked");
        });
    }
} else if (window.location.pathname.includes("forgot_password.html")) {
    const passwrodButton = document.querySelector("#password_btn");
    if (passwrodButton) {
        passwrodButton.addEventListener('click', () => {
            alert("Password button has been clicked");
        });
    }
}
