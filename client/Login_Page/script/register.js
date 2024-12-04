const server = "http://localhost:8080";

const registerButton = document.getElementById("sign_up_btn");

registerButton.addEventListener("click", async (event) => {
    event.preventDefault();
    const response = await fetch(`${server}/register`, { 
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: document.getElementById("username").value,
            password: document.getElementById("password").value,
            fname: document.getElementById("fname").value,
            lname: document.getElementById("lname").value,
            email: document.getElementById("email").value
        })
    });
    
    if (response.ok) {
        /*console.log("Registration");
        const currentUser = await response.json();
        console.log(JSON.stringify(currentUser));
        sessionStorage.setItem("userInfo", JSON.stringify(currentUser));*/

        window.location.replace("http://127.0.0.1:5500/client/Login_Page/src/index.html");   
    }
    else {
        var errorCode = document.createElement("p");
        errorCode.textContent = "Registration Failed. Please Try Again";
        errorCode.style.color = "red";

        document.getElementById("registrationForm").appendChild(errorCode);
    }
})