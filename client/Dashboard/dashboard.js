const user_key = 0;

document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(sessionStorage.getItem("userInfo"));

    if (user) {

        // populate userKey
        user_key = user.userData.userKey;
        // populate profile
        console.log(user.userData);

        document.getElementById("fname").textContent = user.userData.fname;

        document.getElementById("lname").textContent = user.userData.lname;

        document.getElementById("emailtext").textContent = user.userData.email;

        // populate committees

        // request server

        // populate inbox

        // populate friends
    }
    else {

    }
});

for (let i = 1; i < 4; i++) {
    document.getElementById(`panel${i}`).style.display = "none";
}

const menuButtons = document.querySelectorAll(".menuButton");

for (let i = 0; i < menuButtons.length; i++) {
    menuButtons[i].addEventListener("click", function() {

        //hide all divs
        document.querySelectorAll(".contentPanel").forEach((element) => {
            element.style.display = "none";
        });

        // find div with id that matches data-target, show that div
        document.getElementById(`${this.dataset.target}`).style.display = "block";
    });
}



// update profile


// join committee


// 




function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Close modal if user clicks outside of it
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
}

document.getElementById("joinCommitteeForm").onsubmit = function(event) {
    event.preventDefault(); // Prevent page reload on submit
    const committeeId = document.getElementById("committeeId").value;
    alert("Committee ID submitted: " + committeeId);
    closeModal("modalJoinCommittee"); // Close modal after submission
};


document.getElementById("createCommitteeForm").onsubmit = function(event) {
    event.preventDefault();
    const committeeName = document.getElementById("committeeName").value;
    alert("Committee Created: " + committeeName);
    closeModal("modalNewCommittee"); // Close modal if desired after submission
};

document.getElementById("inviteUsersForm").onsubmit = function(event) {
    event.preventDefault();
    const userEmail = document.getElementById("inviteUser").value;
    alert("Invitation sent to: " + userEmail);
    document.getElementById("inviteUser").value = ""; // Clear input after submission
};

const userList = [];

document.getElementById("addUserButton").onclick = function() {
    const usernameInput = document.getElementById("inviteUser");
    const username = usernameInput.value.trim();

    if (username && userList.length < 10 && !userList.includes(username)) {
        userList.push(username);
        updateUserList();
        usernameInput.value = ""; // Clear input after adding
    } else {
        alert("Please enter a valid username (unique and up to 10 users).");
    }
};

function updateUserList() {
    const userListElement = document.getElementById("userList");
    userListElement.innerHTML = ""; // Clear current list
    userList.forEach((user, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = user;
        const removeButton = document.createElement("span");
        removeButton.textContent = "Remove";
        removeButton.className = "removeUser";
        removeButton.onclick = function() {
            userList.splice(index, 1); // Remove user from array
            updateUserList(); // Update displayed list
        };
        listItem.appendChild(removeButton);
        userListElement.appendChild(listItem);
    });
}

document.getElementById("createCommitteeForm").onsubmit = function(event) {
    event.preventDefault();
    const committeeName = document.getElementById("committeeName").value;
    alert("Committee Created: " + committeeName + "\nInvited Users: " + userList.join(", "));
    closeModal("modalNewCommittee"); // Close modal after submission
    // Here, you can handle the actual submission logic (e.g., send data to server)
};