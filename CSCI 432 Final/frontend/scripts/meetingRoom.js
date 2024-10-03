let membersVisible = false;
let chatVisible = false;


document.getElementById("toggleMembers").onclick = function() {
    console.log("show members");
    if (membersVisible == false) {
    document.getElementById("memberList").style.display = "flex";
    }
    else {
        document.getElementById("memberList").style.display = "none";
    }
    membersVisible = !membersVisible;
}

document.getElementById("toggleChat").onclick = function() {
    if (chatVisible == false) {
        document.getElementById("chatBox").style.display = "flex";
    }
    else {
        document.getElementById("chatBox").style.display = "none";
    }
    chatVisible = !chatVisible;
}