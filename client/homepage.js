

document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(sessionStorage.getItem("userInfo"));

    if (user) {
        document.getElementById("dashboardRedirect").disabled = false;
        document.getElementById("dashboardRedirect").textContent = `${user.userData.fname} ${user.userData.lname}'s Dashboard`;

        document.getElementById("loginButton").textContent = "Log out";
        const registerButton = document.getElementById("registerButton");
        if (registerButton) {
            registerButton.parentNode.removeChild(registerButton);
        }
    }
});

document.getElementById("loginButton").addEventListener("click", (event) => {
    if (event.target.textContent == "Login") {
        window.location.replace("http://127.0.0.1:5500/client/Login_Page/src/index.html");
    }
    else {
        sessionStorage.removeItem("userInfo");
        window.location.reload();
    }
});

document.getElementById("registerButton").addEventListener("click", (event) => {
    window.location.href = "http://127.0.0.1:5500/client/Login_Page/src/register.html";
});

document.getElementById("dashboardRedirect").addEventListener("click", (event) => {
    window.location.href = "http://127.0.0.1:5500/client/Dashboard/dashboard.html";
});


