const server = "http://localhost:8080";

document.getElementById("submit").addEventListener("click", async function() {
    const response = await fetch(`${server}/login`, {
        method: "GET",
        username: `${document.getElementById("username").value}`,
        password: `${document.getElementById("password").value}`
        
    });
});